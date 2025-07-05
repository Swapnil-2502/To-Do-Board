import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true,
        lowercase: true,
    },
    password:{
        type:String,
        required: true,
        minlength: 5,
    }
},{ timestamps: true })

export const users = mongoose.model("users",userSchema)
