import express from "express"
import dotenv from "dotenv"
import cors from "cors";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello from root route")
})

app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`)
})
