import express from "express";
import { User } from "../models/User.model";

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }


        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be atleast 6 characters" })
        }

        if (username.length < 3) {
            return res.status(400).json({ error: "Username must be atleast 3 characters" })
        }

        // check if user already exists

        const existingUser = await User.findOne({$or:[{email},{username}]})
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email and username" })
        }

        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}`;

        const user = new User({
            username,
            email,
            password,
            profileImage
        })


    } catch (error) {

    }
})
router.post("/login", async (req, res) => {
    res.send("login")
})


export default router