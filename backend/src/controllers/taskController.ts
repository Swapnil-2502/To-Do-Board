import { Request, Response } from "express";
import { Task } from "../models/tasks";
import { logAction } from "../utils/logAction";
import { AuthRequest } from "../middleware/authMiddleware";

export async function getTasks(_req: Request, res: Response){
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

export async function createTask(req: AuthRequest,res: Response):Promise<any>{
    const { title, description, assignedTo, status, priority } = req.body;

    try{
        const task = await Task.create({ title, description, assignedTo, status, priority });
        
        await logAction({userId: req.user!, taskId: task._id.toString(), type:"created",message:`Created task "${title}"`})
        res.status(201).json(task);
    }
    catch(error){
        res.status(400).json({ message: "Task creation failed", error: error });
    }
}

export async function updateTask (req: AuthRequest, res: Response):Promise<any>{
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    await logAction({userId: req.user!, taskId: task._id.toString(), type:"updated",message:`Updated task "${task.title}"`})
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Task update failed", error: err });
  }
};

export async function deleteTask (req: AuthRequest, res: Response):Promise<any>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).json({ message: "Task not found" });
        
            await logAction({userId: req.user!, taskId: task._id.toString(), type:"deleted",message:`Deleted task "${task.title}"`})
        res.json({ message: "Task deleted" }); 
    }
    catch(error){
        res.status(500).json({ message: "Task deletion failed", error: error });
    }   
    
}

