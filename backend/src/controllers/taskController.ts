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
        const populatedTask = await Task.findById(task._id).populate("assignedTo", "name email");

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
              io.to(socketId).emit("task:created", populatedTask);
            }
        }
        res.status(201).json(populatedTask);
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

    if(task.title !== existingTask?.title){
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
        type:"moved",
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

export async function smartAssignTask(req: AuthRequest, res: Response):Promise<any> {
    try{
      const taskId = req.params.id;
      const taskDetails = await Task.findById(taskId)
  
      if(taskDetails?.status === "Done") return res.status(400).json({ message: "This task has Done status and cannot be assigned to anyone" });

      const allusers = await users.find()

      const taskCounts = await Task.aggregate([
          {
            $match: {
              assignedTo: { $ne: null },
              status: { $in: ["Todo", "In Progress"] },
            },
          },
          {
            $group: {
              _id: "$assignedTo",
              count: { $sum: 1 },
            },
          },
      ]);

      //console.log("taskCounts->", taskCounts)

      const userTaskMap: Record<string, number> = {};
        taskCounts.forEach((entry) => {
          userTaskMap[entry._id.toString()] = entry.count;
      });

      //console.log("userTaskMap-> ",userTaskMap)

      let selectedUser = null;
      let minTasks = Infinity;

      for(let user of allusers){
        const count = userTaskMap[user._id.toString()] || 0
        if(count < minTasks){
          minTasks = count
          selectedUser = user
        }
      }

      if (!selectedUser) {
        return res.status(400).json({ message: "No users found to assign." });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { assignedTo: selectedUser._id },
        { new: true }
      ).populate("assignedTo", "name email");

      await logAction({
        userId: req.user!,
        taskId: taskId,
        type: "updated",
        message: `${selectedUser.name} was smart-assigned to task "${updatedTask?.title}"`,
      });

      io.emit("task:updated", updatedTask);

      res.json(updatedTask);

    }
    catch(error){
      console.error("Smart Assign failed", error);
      res.status(500).json({ message: "Smart Assign failed." });
    }
}