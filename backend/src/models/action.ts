import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks', required:true},
    type: {
        type:String,
        enum:["created", "updated", "deleted", "moved"],
        required: true,  
    },
    message: {type:String, required:true}
}, { timestamps: true })

export const Action = mongoose.model("actions",actionSchema)