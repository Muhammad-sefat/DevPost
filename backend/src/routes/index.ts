import { Router } from "express";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/user/user.routes";
import { connectionsRoutes } from "@/modules/connections/connections.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/connections", connectionsRoutes);

export const routes = router;
