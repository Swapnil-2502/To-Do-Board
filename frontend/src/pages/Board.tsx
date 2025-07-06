import { useEffect, useState } from "react";
import "./Board.css"
import type { Task } from "../types";
import { getTasks, updateTask } from "../api/task";

const STATUSES: Task["status"][] = ["Todo", "In Progress", "Done"] as const;

export default function Board(){
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(()=>{
        const fetchTasks = async () => {
            try{
                const data = await getTasks();
                setTasks(data);
            }
            catch(error){
                console.error("Error loading tasks:", error);
            }
        }
        fetchTasks();
    },[])

    const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
        const taskId = e.dataTransfer.getData('taskId')
        const fromstatus = e.dataTransfer.getData('fromstatus')

        if (fromstatus === newStatus) return;

        const taskToUpdate = tasks.find((t) => t._id === taskId)
        if (!taskToUpdate) return;

        try{
            await updateTask(taskId,{status:newStatus})
            setTasks((prev)=>
                prev.map((t) => (t._id === taskId ? {...t,status:newStatus}: t))
            )
        }
        catch(error){
            console.error("Failed to update task status", error);
        }

    }

  return (
    <>
    <div className="topbar">
        <h2>Real-Time Kanban</h2>
        <button className="create-btn">+ Create Task</button>
    </div>
    <div className="board-container">
        {STATUSES.map((status)=>(
            <div key={status} className="board-column">
                <h3>{status}</h3>
                <div className="task-list" data-status={status}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add("drag-over");
                    } }
                    onDragLeave={(e) => {
                        e.currentTarget.classList.remove("drag-over");
                    }}
                    onDrop={(e) => {
                        e.currentTarget.classList.remove("drag-over");
                        handleDrop(e,status)
                    } }
                    >
                    {tasks
                        .filter((task) => task.status === status)
                        .map((task)=>(
                            <div key={task._id} className="task-card" 
                                draggable 
                                onDragStart={(e)=>{
                                    e.dataTransfer.setData('taskId',task._id)
                                    e.dataTransfer.setData('fromstatus',task.status)
                                }}
                            >
                                <div className="task-header">
                                    <h4>{task.title}</h4>
                                    <span className={`badge p${task.priority}`}>P{task.priority}</span>
                                </div>
                                <p>{task.description}</p>                               
                            </div>
                        ))
                    }
                </div>
            </div>  
        ))}
    </div>
    </>
  )
}

