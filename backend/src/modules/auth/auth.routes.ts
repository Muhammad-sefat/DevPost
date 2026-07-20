import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signup);
router.post(
    "/verify-email",
    authController.verifyEmail
);
router.post("/signin", authController.signin);

export const authRoutes = router;