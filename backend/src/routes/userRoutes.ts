import express from "express";
import type { RequestHandler } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { getAllUsers } from "../controllers/userController";

const router = express.Router()

router.use(requireAuth as RequestHandler)

router.get("/",getAllUsers)

export default router