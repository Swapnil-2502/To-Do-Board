import express from "express";
import type { RequestHandler } from "express";
import { createTask, deleteTask, getTasks, smartAssignTask, updateTask } from "../controllers/taskController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router()

router.use(requireAuth as RequestHandler)

router.post("/",createTask)
router.get("/",getTasks)
router.put("/:id",updateTask)
router.delete("/:id",deleteTask)
router.post("/:id/smart-assign", smartAssignTask)

export default router