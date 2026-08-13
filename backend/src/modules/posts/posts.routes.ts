import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { postsController } from "./posts.controller";

const router = Router();

router.post("/", auth, postsController.saveFinalPost);
router.get("/history", auth, postsController.getPostHistory);
router.get("/streaks", auth, postsController.getPostStreaks);

export const postsRoutes = router;
export default postsRoutes;
