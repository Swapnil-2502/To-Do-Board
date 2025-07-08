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
        await Action.create({ user: userId, task: taskId, type, message });
    } catch (err) {
        console.error("Failed to log action", err);
    }
}