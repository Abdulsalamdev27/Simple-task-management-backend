import express from "express";
import "dotenv/config";


import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js"



const app = express();
app.use(express.json())

const PORT = process.env.PORT;



app.use("/api/auth", authRoutes)


app.use("/api",(req, res)=>{
    res.send("Api is running")

});

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
    connectDB();
}); 