import axios from "./axios"
import type { Task } from "../types"


const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
}

export const getTasks = async ():Promise<Task[]> => {
    const res = await axios.get("/tasks", getAuthHeader());
    return res.data;
}

export const createTask = async (task: Partial<Task>):Promise<Task> => {
    const res = await axios.post("/tasks", task, getAuthHeader());
    return res.data;
}

export const updateTask = async (id:string, updates:Partial<Task>):Promise<Task> => {
    const res = await axios.put(`/tasks/${id}`, updates, getAuthHeader());
    return res.data;
}

export const deleteTask = async (id: string):Promise<{ message: string }> => {
    const res = await axios.delete(`/tasks/${id}`,getAuthHeader())
    return res.data
}