import express from "express";
import cloudinary from "../lib/cloudinary.js"
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

router.get("/user-book", protectRoute, async(req, res)=>{
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json({books})
    } catch (error) {
        console.log("error while geting user books", error.message)
        res.status(500).json({ message: error.message })
    }
})

router.delete("/delete-books/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        // check the user is the owner of the book
        if (book.user.toString() != req.user._id.toString()) {
            return res.status(404).json({ message: "user not authorized to delete this book" })
        }

        // delete the image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("error while delete image from cloudinary", deleteError)

            }
        }

        await book.deleteOne()

        res.json({ message: "book delete successfully" })

    } catch (error) {
        console.log("error while deleting books", error.message)
        res.status(500).json({ message: error.message })
    }
})

export default router;