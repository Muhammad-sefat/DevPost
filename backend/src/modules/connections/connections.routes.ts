import { Router } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { connectionsController } from "./connections.controller";

const router = Router();

// Retrieve all connections status
router.get("/", auth, connectionsController.getConnectionStatus);

// Redirect to GitHub OAuth screen
router.get("/github/connect", connectionsController.connectGithubRedirect);

// Disconnect GitHub connection
router.delete("/github", auth, connectionsController.disconnectGithub);

// Connect WakaTime (Save API Key)
router.post("/wakatime", auth, connectionsController.connectWakatime);

// Disconnect WakaTime connection
router.delete("/wakatime", auth, connectionsController.disconnectWakatime);

export const connectionsRoutes = router;
