import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"
import userRoutes from "./routes/userRoutes"
import actionRoutes from "./routes/actionRoutes";


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({
  origin:["http://localhost:5173","https://to-do-board-alpha.vercel.app"],
  credentials: true,
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin:["http://localhost:5173","https://to-do-board-alpha.vercel.app"],
        credentials: true,
        methods:['GET','POST','PUT','DELETE']
    }
})

const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("join", (userId: string) => {
    userSocketMap.set(userId, socket.id); 
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    for (const [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

export {io, userSocketMap}

app.use("/api/auth",authRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/users",userRoutes)
app.use("/api/actions", actionRoutes);

app.get("/",(req,res)=>{
    res.send("Hello from root route")
})

connectDB().then(()=>{
        server.listen(PORT,()=>{
        console.log(`Server + Socket.IO started at PORT ${PORT}`)
    })
})


