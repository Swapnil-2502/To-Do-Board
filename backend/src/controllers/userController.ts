import { Request, Response } from "express";
import { users } from "../models/users";

export async function getAllUsers(_req: Request, res: Response){
  try {
    const allusers = await users.find()
    
    res.json(allusers.map((user) => ({
      name: user.name,
      email: user.email
    })));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetching users", error: err });
  }
}