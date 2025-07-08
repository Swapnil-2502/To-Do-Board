import { Request, Response } from "express";
import { Task } from "../models/tasks";
import { logAction } from "../utils/logAction";
import { AuthRequest } from "../middleware/authMiddleware";
import { users } from "../models/users";
import { io, userSocketMap } from "../index";


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

        const assigneedetails = await users.findById(assignedTo)
        await logAction(
          {
            userId: req.user!, 
            taskId: task._id.toString(), 
            type:"created",
            message:`Created task "${title} and assigned to ${assigneedetails ? assigneedetails.name : "Unknown User"}"`
          }) 
        
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (userId !== req.user?.toString()) {
            io.to(socketId).emit("task:created", task);
          }
        }
        res.status(201).json(task);
    }
    catch(error){
        res.status(400).json({ message: "Task creation failed", error: error });
    }
}

export async function updateTask (req: AuthRequest, res: Response):Promise<any>{

  try {
    const existingTask = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("assignedTo", "name email");
  
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task) {
      io.emit("task:updated", task); 
    }
    res.json(task);

    if(req.body.title !== existingTask?.title){
        await logAction(
        {
          userId: req.user!, 
          taskId: task._id.toString(), 
          type:"updated",
          message:`Updated task from "${existingTask?.title}" to "${task.title}"`
        })
    }
    
    const assigneedetails = await users.findById(req.body.assignedTo)
    
    if(req.body.assignedTo && req.body.assignedTo !== existingTask?.assignedTo?.toString()){
      await logAction({
        userId: req.user!,
        taskId: task._id.toString(),
        type:"updated",
        message: `Assigned task "${existingTask?.title}" to ${assigneedetails ? assigneedetails.name : "Unknown User"}`
      })
    }

    const currentUser = await users.findById(req.user)
    if(existingTask?.status !== task.status){
      await logAction({
        userId: req.user!,
        taskId: task._id.toString(),
        type:"updated",
        message: `${currentUser?.name} Moved task "${task.title}" from ${existingTask?.status} to ${task.status}`
      })
    }
    
  } catch (err) {
    res.status(400).json({ message: "Task update failed", error: err });
  }
};

export async function deleteTask (req: AuthRequest, res: Response):Promise<any>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).json({ message: "Task not found" });
        
        await logAction(
          {
            userId: req.user!, 
            taskId: task._id.toString(), 
            type:"deleted",
            message:`Deleted task "${task.title}"`
          })

        if (task) {
          io.emit("task:deleted", task._id); 
        }
        res.json({ message: "Task deleted" }); 
    }
    catch(error){
        res.status(500).json({ message: "Task deletion failed", error: error });
    }   
    
}

