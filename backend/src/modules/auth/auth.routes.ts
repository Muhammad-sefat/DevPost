import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signup);
router.post(
    "/verify-email",
    authController.verifyEmail
);
router.post("/signin", authController.signin);
router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post("/google", authController.googleSignin);

router.post("/github", authController.githubSignin);

export const authRoutes = router;