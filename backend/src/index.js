import express from "express";
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT;

app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
    res.send("Hi This Is Akash mahto")
})

app.listen(port, () => {
    console.log(`server is running on this port http://localhost:${port}`)
    connectDB()
})
