import { useEffect, useState } from "react";
import "./Board.css"
import type { Task } from "../types";
import { getTasks } from "../api/task";

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
                <div className="tast-list" data-status={status}>
                    {tasks
                        .filter((task) => task.status === status)
                        .map((task)=>(
                            <div key={task._id} className="task-card">
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

