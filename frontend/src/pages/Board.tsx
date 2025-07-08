import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Board.css"
import type { Task } from "../types";
import { createTask, getTasks, updateTask } from "../api/task";
import CreateTaskModal from "../components/CreateTaskModal";
import { useAuth } from "../hooks/useAuthContext";


const STATUSES: Task["status"][] = ["Todo", "In Progress", "Done"] as const;

export default function Board(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const { user, loading } = useAuth();


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

    const navigate = useNavigate()

    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        navigate("/login");
        return null;
    }

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
        <div style={{display: "flex",gap:"6px"}}>
            <button className="activity-btn" onClick={() => navigate("/activity")}>
                    🕒 Activities
            </button>
            <button className="create-btn" onClick={() => setShowModal(true)}>+ Create Task</button>
        </div>
            {(showModal || editTask)&& (
                <CreateTaskModal 
                    onClose={() => {
                        setShowModal(false);
                        setEditTask(null);
                        }
                    }
                    onCreate={async (taskData) => {
                        try {
                            const newTask = await createTask(taskData);
                            setTasks((prev) => [...prev, newTask]);
                        } catch (err) {
                            console.error("Error creating task", err);
                        }
                    }}
                    onUpdate={async (id, updates)=>{
                        try {
                            const updated = await updateTask(id, updates);
                            setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
                        } catch (err) {
                            console.error("Error updating task", err);
                        }
                    }}
                    taskToEdit={editTask ?? undefined}
                />
            )}
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
                                <div className="task-meta">
                                    <span>Assignee: {task.assignedTo?.name}</span>
                                    <button onClick={() => setEditTask(task)}>Edit</button>
                                </div>
                                
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

