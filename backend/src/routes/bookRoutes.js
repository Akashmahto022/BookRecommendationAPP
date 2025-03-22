import express from "express";
import cloudinary from "../lib/cloudinary"
import { Book } from "../models/Book.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router()


router.post("/add-book", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "Please provide all the fields" })
        }

        //upload image to the cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url


        // save the data in the database
        const newBook = new Book(
            {
                title,
                caption,
                rating,
                image: imageUrl,
                user: req.user._id
            }
        )

        await newBook.save()

        res.status(201).json({ message: "created Book", newBook })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})


router.get("/get-books", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;



        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments()

        res.send({
            books,
            currentPage: page,
            totalBooks: totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })


    } catch (error) {
        console.log("error while getting books", error.message)
        res.status(500).json({ message: error.message })
    }
})

export default router;