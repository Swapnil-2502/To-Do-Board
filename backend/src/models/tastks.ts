import mongoose from "mongoose";

export type TaskStatus = "Todo" | "In Progress" | "Done";

const tastkSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: {
      type: Number,
      default: 1,
    },
},{ timestamps: true })

export const Task = mongoose.model("tasks", tastkSchema);