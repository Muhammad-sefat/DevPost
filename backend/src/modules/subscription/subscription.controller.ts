import { Request, Response } from "express";
import { catchAsync } from "@/utils/catch-async";
import { sendResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { subscriptionService } from "./subscription.service";
import { createCheckoutSessionSchema, verifySessionSchema } from "./subscription.validation";

const getPlans = catchAsync(async (_req: Request, res: Response) => {
  const plans = subscriptionService.getPlans();
  sendResponse(res, 200, "Plans retrieved successfully", plans);
});

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "You must be signed in to purchase a plan.");
  }

  const validation = createCheckoutSessionSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((err) => err.message).join(", ");
    throw new ApiError(400, errorMsg);
  }

  const result = await subscriptionService.createCheckoutSession(
    userId,
    validation.data.planId
  );

  sendResponse(res, 200, "Checkout session created successfully", result);
});

const verifySession = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const validation = verifySessionSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((err) => err.message).join(", ");
    throw new ApiError(400, errorMsg);
  }

  const result = await subscriptionService.verifySession(
    userId,
    validation.data.sessionId
  );

  sendResponse(res, 200, "Subscription verified successfully", result);
});

const getMySubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await subscriptionService.getUserSubscription(userId);
  sendResponse(res, 200, "User subscription retrieved successfully", result);
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  if (!signature) {
    throw new ApiError(400, "Missing stripe-signature header");
  }

  const rawBody = (req as any).rawBody;
  if (!rawBody) {
    throw new ApiError(400, "Missing raw body buffer for signature verification");
  }

  const result = await subscriptionService.handleWebhook(rawBody, signature);
  res.status(200).json(result);
});

export const subscriptionController = {
  getPlans,
  createCheckoutSession,
  verifySession,
  getMySubscription,
  handleWebhook,
};

