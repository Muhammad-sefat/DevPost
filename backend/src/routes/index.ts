import { Router } from "express";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/user/user.routes";
import { connectionsRoutes } from "@/modules/connections/connections.routes";
import { activityRoutes } from "@/modules/activity/activity.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/connections", connectionsRoutes);
router.use("/activity", activityRoutes);

export const routes = router;
