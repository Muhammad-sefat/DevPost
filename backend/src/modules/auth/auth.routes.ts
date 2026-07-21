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

router.post(
    "/resend-verification-otp",
    authController.resendVerificationOtp
);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post(
    "/resend-forgot-password-otp",
    authController.resendForgotPasswordOtp
);

router.post(
    "/verify-forgot-password-otp",
    authController.verifyForgotPasswordOtp
);

router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;