import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { subscriptionController } from "./subscription.controller";

const router = Router();

/**
 * Public route to fetch all plan pricing & features
 * GET /api/v1/subscriptions/plans
 */
router.get("/plans", subscriptionController.getPlans);

/**
 * Stripe webhook endpoint
 * POST /api/v1/subscriptions/webhook
 * Note: Must be public because Stripe servers call this directly!
 */
router.post("/webhook", subscriptionController.handleWebhook);

/**
 * Authenticated routes
 */
router.post("/create-checkout-session", auth, subscriptionController.createCheckoutSession);
router.post("/verify-session", auth, subscriptionController.verifySession);
router.get("/my-subscription", auth, subscriptionController.getMySubscription);

export const subscriptionRoutes = router;

