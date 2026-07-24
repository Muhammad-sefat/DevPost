import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/me", auth, userController.getMe);
router.patch("/profile", auth, userController.updateProfile);
router.delete("/me", auth, userController.deleteAccount);

export const userRoutes = router;