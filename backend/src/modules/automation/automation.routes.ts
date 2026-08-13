import { Router } from "express";
import { automationController } from "./automation.controller";

const router = Router();

router.post("/trigger-daily", automationController.triggerDailyJob);

export const automationRoutes = router;
