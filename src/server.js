import express from "express";
import cookiesParser from "cookie-parser";
import "dotenv/config";


import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import { connectDB } from "./lib/db.js"



const app = express();
app.use(express.json())
app.use(cookiesParser())


const PORT = process.env.PORT;



app.use("/api/auth", authRoutes)
app.use("/api/task", taskRoutes)


app.use("/api",(req, res)=>{
    res.send("Api is running")
});

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
    connectDB();
}); 