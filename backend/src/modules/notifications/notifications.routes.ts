import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { notificationsController } from "./notifications.controller";

const router = Router();

router.get("/settings", auth, notificationsController.getSettings);
router.put("/settings", auth, notificationsController.updateSettings);

export const notificationsRoutes = router;
