import axios from "./axios"
import type { User } from "../types"


const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
}

export const getUsers = async():Promise<User[]> => {
    const res = await axios.get("/users", getAuthHeader());
    return res.data;
}