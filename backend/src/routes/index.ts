import { Router } from "express";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/user/user.routes";

// Every new module (e.g. modules/github, modules/wakatime, modules/ai-post
// for DevPost) gets registered here. One place to see the whole API surface.
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export const routes = router;
