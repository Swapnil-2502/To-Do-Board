import { useEffect, useState } from "react";
import type { Task, TaskPayload } from "../types";
import { getUsers } from "../api/user";


interface Props {
    onClose?: () => void;
    onCreate?: (task: TaskPayload) => void;
    onUpdate?: (id: string, updates: TaskPayload) => void;
    taskToEdit?: Task;
}
export default function CreateTaskModel({onClose,onCreate,onUpdate,taskToEdit}:Props){
    const [form, setForm] = useState<TaskPayload>({
        title:taskToEdit?.title || "",
        description:taskToEdit?.description || "",
        status: taskToEdit?.status || "Todo",
        priority: taskToEdit?.priority || 1,
        assignedTo: taskToEdit?.assignedTo?._id || "",
        updatedAt: ""
    })

    const [users, setUsers] = useState<{ name: string; email: string; id: string }[]>([]);

    useEffect(()=>{
        const fetchusers = async () =>{
            try{
                const data = await getUsers()
                setUsers(data)
            }
            catch(error){
                console.error("Failed to load users", error);
            }
        }
        fetchusers()
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       const { name, value } = e.target;
       setForm((prev)=>({
        ...prev,
        [name]: name === 'priority'? Number(value): value
       }))
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()


        if(taskToEdit && onUpdate){
            onUpdate(taskToEdit._id,form)
        }else if(onCreate) {
            onCreate(form)
        }
        
        if (onClose) onClose()
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
                    <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                    <select name="priority" value={form.priority} onChange={handleChange}>
                        <option value={1}>P1 (Low)</option>
                        <option value={2}>P2 (Medium)</option>
                        <option value={3}>P3 (High)</option>
                    </select>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                        <option value="">-- Select Assignee --</option>
                        {
                            users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))
                        }
                    </select>
                    <button type="submit">{taskToEdit ? "Update" : "Create"}</button>
                    <button type="button" onClick={onClose} className="cancel">Cancel</button>
                </form>
            </div>

        </div>
    )
}