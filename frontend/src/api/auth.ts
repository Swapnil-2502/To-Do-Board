import axios from "./axios";
import type { AuthResponse } from "../types";

export const registerUser = async (name:string, email: string, password: string)=> {
    const res = await axios.post<AuthResponse>("/auth/register",{name,email,password})
    return res.data;
}

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};

