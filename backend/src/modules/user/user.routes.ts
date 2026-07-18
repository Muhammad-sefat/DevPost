import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { ROLES } from "@/constants/roles";

const router = Router();

router.get("/me", authenticate, userController.getMe);

// Example of role-gated route: only ADMIN and SUPER_ADMIN can list all users.
router.get("/", authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), userController.listUsers);

export const userRoutes = router;
