import { io } from "../index";
import { Action } from "../models/action";


export const logAction = async({
    userId,
    taskId,
    type,
    message
}:{
    userId: string;
    taskId: string;
    type: "created" | "updated" | "deleted" | "moved";
    message: string;
}) => {
    
    try {
        const action = await Action.create({ user: userId, task: taskId, type, message });

        const populated =  await (await action.populate("user","name email")).populate("task","title")
        
        io.emit("log:created", populated);
    } catch (err) {
        console.error("Failed to log action", err);
    }
}