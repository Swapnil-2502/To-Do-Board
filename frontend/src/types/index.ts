export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface Task{
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  assignedTo?: string; 
  updatedAt: string;
  force?: boolean;
}