import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes"
import taskRoutes from "./routes/taskRoutes"
import userRoutes from "./routes/userRoutes"
import actionRoutes from "./routes/actionRoutes";


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/users",userRoutes)
app.use("/api/actions", actionRoutes);

app.get("/",(req,res)=>{
    res.send("Hello from root route")
})

connectDB().then(()=>{
        app.listen(PORT,()=>{
        console.log(`Server started at PORT ${PORT}`)
    })
})

