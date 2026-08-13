import { Router } from "express";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/user/user.routes";
import { connectionsRoutes } from "@/modules/connections/connections.routes";
import { activityRoutes } from "@/modules/activity/activity.routes";
import { suggestionsRoutes } from "@/modules/suggestions/suggestions.routes";
import { notificationsRoutes } from "@/modules/notifications/notifications.routes";
import { postsRoutes } from "@/modules/posts/posts.routes";
import { automationRoutes } from "@/modules/automation/automation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/connections", connectionsRoutes);
router.use("/activity", activityRoutes);
router.use("/suggestions", suggestionsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/posts", postsRoutes);
router.use("/automation", automationRoutes);

export const routes = router;
