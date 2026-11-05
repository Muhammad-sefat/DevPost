import { apiClient } from "@/lib/api-client";

export interface PlanItem {
  id: "basic" | "growth" | "pro";
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

export interface MySubscriptionResponse {
  hasActivePlan: boolean;
  planId: "basic" | "growth" | "pro" | null;
  plan: PlanItem | null;
  status: string;
}

export const getPlansApi = async () => {
  const response = await apiClient.get<{ success: boolean; data: PlanItem[] }>("/subscriptions/plans");
  return response.data;
};

export const createCheckoutSessionApi = async (planId: string) => {
  const response = await apiClient.post<{
    success: boolean;
    data: { sessionId: string; url: string };
  }>("/subscriptions/create-checkout-session", { planId });
  return response.data;
};

export const verifySessionApi = async (sessionId: string) => {
  const response = await apiClient.post<{
    success: boolean;
    data: {
      verified: boolean;
      planId: "basic" | "growth" | "pro";
      plan: PlanItem;
      status: string;
    };
  }>("/subscriptions/verify-session", { sessionId });
  return response.data;
};

export const getMySubscriptionApi = async () => {
  const response = await apiClient.get<{
    success: boolean;
    data: MySubscriptionResponse;
  }>("/subscriptions/my-subscription");
  return response.data;
};

