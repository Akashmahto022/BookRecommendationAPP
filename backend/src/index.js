import express from "express";
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import cors from 'cors';
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/book", bookRoutes)

app.get('/', (req, res) => {
    res.send("Hi This Is Akash mahto")
})

app.listen(port, () => {
    console.log(`server is running on this port http://localhost:${port}`)
    connectDB()
})
