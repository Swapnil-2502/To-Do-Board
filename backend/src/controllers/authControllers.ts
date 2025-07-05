import { Request, Response } from "express";
import { users } from "../models/users";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt";

export async function Register(req:Request,res:Response):Promise<any>{
    const { name, email, password } = req.body;

    try{
        const existingUser = await users.findOne({email})
        if(existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await users.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken({id: user._id})

        res.status(201).json({
            "msg": "User registered successfully",
            "Token: ": token,
            "User": { id: user._id, name: user.name, email: user.email }
        })
    }
    catch(error){
        res.status(500).json({ message: "Registration failed", error: error });
    }
}

export async function Login(req:Request,res:Response):Promise<any>{
    const {email, password} = req.body

    try{
        const finduser = await users.findOne({email})
        if(!finduser) return res.status(400).json({ message: "User not found" });

        const matchPassword = await bcrypt.compare(password,finduser.password)
        if (!matchPassword) return res.status(400).json({ message: "Invalid password" });

        const token = generateToken({id: finduser._id})

        res.status(201).json({
            "msg": "User logged in successfully",
            "Token: ": token,
            "User": { id: finduser._id, name: finduser.name, email: finduser.email }
        })
    }
    catch(error){
        res.status(500).json({ message: "Login failed", error: error });
    }
}
