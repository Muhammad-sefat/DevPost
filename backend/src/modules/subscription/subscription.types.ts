/**
 * Subscription Plan Definitions & Types
 * 
 * In Stripe, amounts are represented in the smallest currency unit.
 * For USD ($):
 * - $10.00 = 1000 cents
 * - $20.00 = 2000 cents
 * - $30.00 = 3000 cents
 */

export type PlanId = "basic" | "growth" | "pro";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceFormatted: string;
  priceInCents: number;
  currency: string;
  interval: "month";
  description: string;
  popular: boolean;
  buttonText: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<PlanId, PlanDefinition> = {
  basic: {
    id: "basic",
    name: "Basic",
    priceFormatted: "$10",
    priceInCents: 1000, // $10.00
    currency: "usd",
    interval: "month",
    description: "Great for individual developers starting to document their shipping journey.",
    popular: false,
    buttonText: "Get Started",
    features: [
      "1 GitHub account integration",
      "Daily commit & activity tracking",
      "Up to 30 AI post drafts / month",
      "Basic WakaTime metrics sync",
      "Standard Claude AI generation",
      "Community support",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceFormatted: "$20",
    priceInCents: 2000, // $20.00
    currency: "usd",
    interval: "month",
    description: "Perfect for active builders who ship code and post on LinkedIn regularly.",
    popular: true,
    buttonText: "Start Growth",
    features: [
      "3 GitHub accounts integration",
      "Full WakaTime language breakdown",
      "Unlimited AI post drafts",
      "AI contextual editor refinement",
      "RAG memory (learns your writing style)",
      "Priority generation queue",
      "Standard email support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceFormatted: "$30",
    priceInCents: 3000, // $30.00
    currency: "usd",
    interval: "month",
    description: "For prolific creators, tech leads, and open-source advocates.",
    popular: false,
    buttonText: "Go Pro",
    features: [
      "Unlimited GitHub accounts & repos",
      "Advanced coding analytics & graphs",
      "Unlimited post generation & refinement",
      "Custom tone & brand voice tuning",
      "Multi-platform format export (LinkedIn, X)",
      "Early access to new features",
      "1-on-1 priority support",
    ],
  },
};

