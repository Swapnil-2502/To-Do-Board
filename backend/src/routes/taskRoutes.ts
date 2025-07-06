import express from "express";
import type { RequestHandler } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/tastController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router()

router.use(requireAuth as RequestHandler)

router.post("/",createTask)
router.get("/",getTasks)
router.put("/:id",updateTask)
router.delete("/:id",deleteTask)

export default router