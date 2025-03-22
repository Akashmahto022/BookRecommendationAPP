import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // get token

        const token = req.header("Authorization").replace("Bearer", "");
        if (!token) {
            return res.status(401).json({ message: "No authentication token, access denied" })
        }


        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({ message: "Token is not valid" })
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("error while token verification")
        res.status(500).json({ message: error.message })
    }
}