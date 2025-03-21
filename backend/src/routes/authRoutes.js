import express from "express";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

const router = express.Router()

const generateToken = (userId) => {
    console.log("user id", userId)
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2d" });
}

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

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

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email and username" })
        }

        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        const user = new User({
            username,
            email,
            password,
            profileImage
        })
        await user.save();
        console.log(user)

        const token = generateToken(user._id);
        if (!token) {
            return res.status(500).json({ error: "Error in generating token" })

        }
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }, token
        })

    } catch (error) {
        console.error("error in user registration", error);
        res.status(500).send("Internal server error")
    }
})



router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email , password)

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }


        const token = generateToken(user._id);
        if (!token) {
            return res.status(500).json({ error: "Error in generating token" })
        }

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }, token
        })

    } catch (error) {
        console.error("error in user login", error);
        res.status(500).send("Internal server error")
    }
})

export default router;