import { prisma } from "@/config/db";
import { ENV } from "@/config/env";
import { ApiError } from "@/utils/api-error";
import { stripe } from "./stripe.client";
import { SUBSCRIPTION_PLANS, PlanId, SUBSCRIPTION_PLANS as plansMap } from "./subscription.types";

/**
 * In-memory fallback cache for development/demo mode
 * in case Prisma database migrations have not been applied yet.
 */
const inMemorySubscriptions = new Map<string, {
  userId: string;
  plan: PlanId;
  status: "ACTIVE" | "CANCELED";
  updatedAt: Date;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
}>();

export const subscriptionService = {
  /**
   * 1. GET ALL PLANS
   * Returns the static/database plans to the frontend.
   * This is the single source of truth for pricing ($10, $20, $30).
   */
  getPlans() {
    return Object.values(SUBSCRIPTION_PLANS);
  },

  /**
   * 2. CREATE STRIPE CHECKOUT SESSION
   * 
   * How Stripe Checkout works:
   * 1. The user picks a plan (Basic, Growth, Pro).
   * 2. Backend calls `stripe.checkout.sessions.create()`.
   * 3. Stripe creates a secure hosted checkout page with the exact price & description.
   * 4. Stripe returns a session URL (e.g. `https://checkout.stripe.com/c/pay/cs_test_...`).
   * 5. The frontend redirects the user to that URL.
   */
  async createCheckoutSession(userId: string, planId: PlanId) {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new ApiError(400, `Invalid plan selected: ${planId}`);
    }

    // Retrieve user details from database for email pre-fill
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if Stripe API key is set
    if (!ENV.STRIPE_SECRET_KEY || ENV.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      throw new ApiError(
        500,
        "Stripe secret key is not configured. Please add your STRIPE_SECRET_KEY in backend/.env"
      );
    }

    try {
      /**
       * Create Stripe Checkout Session:
       * - mode: 'subscription' -> creates a recurring monthly subscription
       * - line_items: define price directly inline using price_data (no pre-created Stripe Product IDs needed!)
       * - client_reference_id: identifies the user in Stripe events
       * - metadata: custom key-value pairs stored with this session
       * - success_url: where Stripe redirects after successful payment
       * - cancel_url: where Stripe redirects if the user abandons checkout
       */
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: {
                name: `DevPost ${plan.name} Plan`,
                description: plan.description,
              },
              unit_amount: plan.priceInCents, // e.g. 1000 = $10.00
              recurring: {
                interval: plan.interval, // 'month'
              },
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          planId: plan.id,
        },
        // Stripe appends session_id automatically when using {CHECKOUT_SESSION_ID} template
        success_url: `${ENV.CLIENT_URL}/welcome?payment_success=true&plan=${plan.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ENV.CLIENT_URL}/welcome?payment_cancelled=true`,
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error("[Stripe] Failed to create checkout session:", error);
      throw new ApiError(500, error.message || "Failed to initialize Stripe checkout session");
    }
  },

  /**
   * 3. VERIFY CHECKOUT SESSION
   * 
   * When Stripe redirects back to success_url with `session_id`,
   * this endpoint queries Stripe's API to confirm that the session is genuinely paid
   * and marks the user's plan as active.
   */
  async verifySession(userId: string, sessionId: string) {
    if (!ENV.STRIPE_SECRET_KEY || ENV.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      throw new ApiError(500, "Stripe secret key is not configured.");
    }

    try {
      // Fetch session status directly from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Verify that the session belongs to this user and is actually paid
      const sessionUserId = session.client_reference_id || session.metadata?.userId;
      if (sessionUserId && sessionUserId !== userId) {
        throw new ApiError(403, "Session does not match authenticated user");
      }

      const isPaid = session.payment_status === "paid" || session.status === "complete";
      if (!isPaid) {
        throw new ApiError(400, "Payment has not been completed for this session");
      }

      const planId = (session.metadata?.planId as PlanId) || "basic";
      const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;
      const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : null;

      // 1. Persist in database if Prisma model exists
      try {
        if ((prisma as any).subscription) {
          const enumPlan = planId.toUpperCase();
          await (prisma as any).subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan: enumPlan,
              status: "ACTIVE",
              stripeCustomerId,
              stripeSubscriptionId,
              stripeSessionId: session.id,
            },
            update: {
              plan: enumPlan,
              status: "ACTIVE",
              stripeCustomerId: stripeCustomerId || undefined,
              stripeSubscriptionId: stripeSubscriptionId || undefined,
              stripeSessionId: session.id,
            },
          });
        }
      } catch (dbErr) {
        console.warn("[Subscription] Database upsert skipped or pending migration, using in-memory store", dbErr);
      }

      // 2. Also keep in memory store
      inMemorySubscriptions.set(userId, {
        userId,
        plan: planId,
        status: "ACTIVE",
        updatedAt: new Date(),
        stripeSessionId: session.id,
        stripeSubscriptionId: stripeSubscriptionId || undefined,
      });

      return {
        verified: true,
        planId,
        plan: SUBSCRIPTION_PLANS[planId],
        status: "ACTIVE",
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      console.error("[Stripe] Verify session error:", error);
      throw new ApiError(500, error.message || "Failed to verify Stripe checkout session");
    }
  },

  /**
   * 4. GET CURRENT USER'S SUBSCRIPTION
   * Returns active plan ID or null/FREE if no active subscription.
   */
  async getUserSubscription(userId: string) {
    // 1. Try DB first
    try {
      if ((prisma as any).subscription) {
        const sub = await (prisma as any).subscription.findUnique({
          where: { userId },
        });

        if (sub && sub.status === "ACTIVE") {
          const planKey = sub.plan.toLowerCase() as PlanId;
          return {
            hasActivePlan: true,
            planId: planKey,
            plan: SUBSCRIPTION_PLANS[planKey] || null,
            status: sub.status,
            createdAt: sub.createdAt,
          };
        }
      }
    } catch {
      // Fall through to memory store
    }

    // 2. Memory store check
    const cached = inMemorySubscriptions.get(userId);
    if (cached && cached.status === "ACTIVE") {
      return {
        hasActivePlan: true,
        planId: cached.plan,
        plan: SUBSCRIPTION_PLANS[cached.plan],
        status: cached.status,
        updatedAt: cached.updatedAt,
      };
    }

    return {
      hasActivePlan: false,
      planId: null,
      plan: null,
      status: "FREE",
    };
  },

  /**
   * 5. WEBHOOK HANDLER
   * Handles asynchronous lifecycle notifications from Stripe:
   * - `checkout.session.completed`
   * - `customer.subscription.updated`
   * - `customer.subscription.deleted`
   */
  async handleWebhook(rawBody: Buffer, signature: string) {
    if (!ENV.STRIPE_WEBHOOK_SECRET || ENV.STRIPE_WEBHOOK_SECRET === "whsec_placeholder") {
      throw new ApiError(500, "STRIPE_WEBHOOK_SECRET is not configured.");
    }

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        ENV.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      throw new ApiError(400, `Webhook Error: ${err.message}`);
    }

    // Process event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = (session.metadata?.planId as PlanId) || "basic";
        if (userId) {
          inMemorySubscriptions.set(userId, {
            userId,
            plan: planId,
            status: "ACTIVE",
            updatedAt: new Date(),
            stripeSessionId: session.id,
            stripeSubscriptionId: session.subscription,
          });
          console.log(`[Stripe Webhook] User ${userId} upgraded to ${planId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription canceled: ${subscription.id}`);
        // Handle cancellation
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return { received: true };
  },
};
