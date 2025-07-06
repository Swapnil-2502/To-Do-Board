import { Request, Response } from "express";
import { Task } from "../models/tastks";

export async function getTasks(_req: Request, res: Response){
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

export async function createTask(req: Request,res: Response):Promise<any>{
    const { title, description, assignedTo, status, priority } = req.body;

    try{
        const task = await Task.create({ title, description, assignedTo, status, priority });
        res.status(201).json(task);
    }
    catch(error){
        res.status(400).json({ message: "Task creation failed", error: error });
    }
}

export async function updateTask (req: Request, res: Response):Promise<any>{
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Task update failed", error: err });
  }
};

export async function deleteTask (req: Request, res: Response):Promise<any>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" }); 
    }
    catch(error){
        res.status(500).json({ message: "Task deletion failed", error: error });
    }   
    
}
