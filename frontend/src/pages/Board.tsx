import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Board.css"
import type { Task } from "../types";
import { createTask, deleteTask, getTasks, smartAssignTask, updateTask } from "../api/task";
import CreateTaskModal from "../components/CreateTaskModal";
import { useAuth } from "../hooks/useAuthContext";
import socket from "../socket";


const STATUSES: Task["status"][] = ["Todo", "In Progress", "Done"] as const;

export default function Board(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const { user, loading } = useAuth();

    const handleSmartAssign = async(taskId: string)=>{
        try{
            const updated = await smartAssignTask(taskId);
            setTasks((prev) => prev.map((t) => (t._id === taskId ? updated: t)))
        }
        catch(error){
            console.error("❌ Failed to smart assign", error);
        }
    }

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

        socket.on("task:created",(newTask: Task)=>{
            setTasks((prev)=>[...prev,newTask])
        })

        socket.on("task:updated", (updatedTask: Task) => {
            setTasks((prev) =>
            prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
            );
        });

        socket.on("task:deleted", (deletedId: string) => {
            setTasks((prev) => prev.filter((task) => task._id !== deletedId));
        });

        return()=>{
            socket.off("task:created");
            socket.off("task:updated");
            socket.off("task:deleted");
        }
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

    const handleDelete = async (taskId: string) =>{
        if (!confirm("Are you sure you want to delete this task?")) return;
        try{
            await deleteTask(taskId);
                setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task", error);
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
                                    <div>
                                        <button onClick={() => setEditTask(task)}>Edit</button>
                                        <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
                                        {task.status !== "Done" && (
                                            <button onClick={() => handleSmartAssign(task._id)} className="smart-assign-btn">
                                            🧠 Smart Assign
                                            </button>
                                        )}
                                    </div>
                                   
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

