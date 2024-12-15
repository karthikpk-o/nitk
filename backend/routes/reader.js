import express from "express";
import authenticateUser from "../middleware.js";
import { Reader } from "../model/user.js";
import Book from "../model/books.js";

const router = express.Router();

router.post("/books/borrow", authenticateUser, async (req, res) => {
    try {
        const { bookId } = req.body;

        if (req.user.userType !== 'Reader') {
            return res.status(403).json({
                message: "Only readers can borrow books.",
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found.",
            });
        }

        if (book.stock <= 0) {
            return res.status(400).json({
                message: "This book is out of stock.",
            });
        }

        const reader = await Reader.findById(req.user.userId);
        if (reader.borrowedList.length >= 5) {
            return res.status(400).json({
                message: "You can only borrow up to 5 books.",
            });
        }

        reader.borrowedList.push(bookId);
        await reader.save();

        book.stock -= 1;
        await book.save();

        res.status(200).json({
            message: "Book borrowed successfully",
            borrowedBook: book,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.post("/books/return", authenticateUser, async (req, res) => {
    try {
        const { bookId } = req.body;

        if (req.user.userType !== 'Reader') {
            return res.status(403).json({
                message: "Only readers can return books.",
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found.",
            });
        }

        const reader = await Reader.findById(req.user.userId);
        if (!reader) {
            return res.status(404).json({
                message: "Reader not found.",
            });
        }

        if (!reader.borrowedList.includes(bookId)) {
            return res.status(400).json({
                message: "This book is not in your borrowed list.",
            });
        }

        reader.borrowedList = reader.borrowedList.filter(id => id.toString() !== bookId.toString());
        await reader.save();

        book.stock += 1;
        await book.save();

        res.status(200).json({
            message: "Book returned successfully",
            returnedBook: book,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.get("/books/:id", authenticateUser, async (req, res) => {
    try {
        const readerId = req.params.id;

        if (req.user.userType !== 'Reader' && req.user.userId !== readerId) {
            return res.status(403).json({
                message: "You can only view borrowed books for your own account.",
            });
        }

        const reader = await Reader.findById(readerId).populate('borrowedList');
        if (!reader) {
            return res.status(404).json({
                message: "Reader not found.",
            });
        }

        const borrowedBooks = reader.borrowedList;

        if (borrowedBooks.length === 0) {
            return res.status(200).json({
                message: "No borrowed books found.",
                borrowedBooks: [],
            });
        }

        res.status(200).json({
            message: "Borrowed books retrieved successfully",
            borrowedBooks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


export default router;