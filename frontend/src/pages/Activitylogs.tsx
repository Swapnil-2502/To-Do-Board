import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Activitylogs.css"
import { useNavigate } from "react-router-dom";
import socket from "../socket";


interface Action {
  _id: string;
  type: "created" | "updated" | "deleted" | "moved";
  message: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
  task?: {
    title?: string;
  };
}

export default function ActivityLog() {
    const navigate = useNavigate();
  const [logs, setLogs] = useState<Action[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/actions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };

    fetchLogs();

    socket.on("log:created", (newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    })
    
    return () => {
      socket.off("log:created");
    };
  }, []);

  return (
    <>
        <div className="topbar">
            <h2>Real-Time Kanban</h2>
            <button className="back-btn" onClick={() => navigate("/board")}>
                🔙 Go to Dashboard
            </button>
        </div>
        <div className="activity-container">
        <h2>🕒 Recent Activity Logs</h2>
        <ul className="activity-list">
            {logs.map((log) => (
            <li key={log._id} className={`log-item log-${log.type}`}>
                <p>{log.message}</p>
                <small>
                {log.user?.name || log.user?.email || "Unknown"} •{" "}
                {new Date(log.createdAt).toLocaleString()}
                </small>
            </li>
            ))}
        </ul>
        </div>
    
    </>
  );
}
