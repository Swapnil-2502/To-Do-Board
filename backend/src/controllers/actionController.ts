import { Request, Response } from "express";
import { Action } from "../models/action";

export async function getRecentActions(_req: Request, res: Response):Promise<any>{
    try{
        const actions = await Action.find()
            .sort({createAt: -1})
            .limit(20)
            .populate("user", "name email")
            .populate("task", "title")
        res.json(actions)
    }
    catch(error){
        res.status(500).json({ message: "Failed to fetch actions", error: error });
    }
}