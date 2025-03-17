import express from "express";
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"

const app = express();
const port = process.env.PORT;

app.use("/api/auth", authRoutes)

app.listen(port, ()=>{
    console.log(`server is running on this port ${port}`)
})