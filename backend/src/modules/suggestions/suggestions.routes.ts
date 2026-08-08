import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { suggestionsController } from "./suggestions.controller";

const router = Router();

router.get("/today", auth, suggestionsController.getTodaySuggestions);

export const suggestionsRoutes = router;
