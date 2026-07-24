import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signup);
router.post(
    "/verify-email",
    authController.verifyEmail
);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;