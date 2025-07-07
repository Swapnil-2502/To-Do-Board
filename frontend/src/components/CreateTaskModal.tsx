import { useState } from "react";
import type { Task } from "../types";


interface Props {
    onClose: () => void;
    onCreate: (task: Partial<Task>) => void;
}

export default function CreateTaskModel({onClose,onCreate}:Props){
    const [form, setForm] = useState({
        title:"",
        description:"",
        status:"Todo" as Task["status"],
        priority:1
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       const { name, value } = e.target;
       setForm((prev)=>({
        ...prev,
        [name]: name === 'priority'? Number(value): value
       }))
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        onCreate(form)
        onClose()
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Create Task</h2>
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
                    <button type="submit">Create</button>
                    <button type="button" onClick={onClose} className="cancel">Cancel</button>
                </form>
            </div>

        </div>
    )
}