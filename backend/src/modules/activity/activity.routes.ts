import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { activityController } from "./activity.controller";
import { getActivityByDateSchema, getMonthlyActivitySchema } from "./activity.validation";

const router = Router();

router.get("/today", auth, activityController.getTodayActivity);
router.get("/monthly", auth, validate(getMonthlyActivitySchema), activityController.getMonthlyActivity);
router.get("/:date", auth, validate(getActivityByDateSchema), activityController.getActivityByDate);

export const activityRoutes = router;
