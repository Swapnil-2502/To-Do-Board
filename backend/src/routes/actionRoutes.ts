import express from "express";
import { getRecentActions } from "../controllers/actionController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getRecentActions);

export default router;