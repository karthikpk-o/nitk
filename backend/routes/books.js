import express from "express";
import { Author } from "../model/user.js";
import Book from "../model/books.js"
import authenticateUser  from "../middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, async(req, res)=>{
    try{
        const {title, genre, stock} = req.body;
        
        if(req.user.userType != 'Author'){
            res.status(403).json({
                message: "Not authorised to create Books"
            })
        }

        const authorId = req.user.userId;

        if(!title || !genre || stock == null){
            return res.status(400).json({
                message: "All fields are required: title, genre, stock"
            })
        }

        const author = await Author.findById(authorId);
        if(!author){
            res.status(404).json({
                message: "Author not found"
            })
        }

        const newBook = new Book({
            title,
            author: authorId,
            genre,
            stock,
        });
        await newBook.save();

        res.status(201).json({
            message: "Book added successfully",
            book: newBook,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server error"
        })
    }
})


router.get("/", authenticateUser, async (req, res) => {
    try {
        const { title, author, genre } = req.query;

        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' }; 
        }

        if (genre) {
            query.genre = { $regex: genre, $options: 'i' }; 
        }

        if (author) {
            const authorDoc = await Author.findOne({ name: { $regex: author, $options: 'i' } });
            if (authorDoc) {
                query.author = authorDoc._id;  
            } else {
                return res.status(404).json({
                    message: "Author not found.",
                });
            }
        }

        const bookList = await Book.find(query);
        if (bookList.length === 0) {
            return res.status(404).json({
                message: "No books found matching the search criteria.",
            });
        }

        res.status(200).json({
            message: "Books retrieved successfully",
            books: bookList,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


router.get("/author/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.userType !== 'Author') {
            return res.status(403).json({
                message: "Only authors can access this route.",
            });
        }

        if (req.user.userId !== id) {
            return res.status(403).json({
                message: "You are not authorized to view this author's books.",
            });
        }
        const booksByAuthor = await Book.find({ author: id });

        if (!booksByAuthor.length) {
            return res.status(404).json({
                message: "No books found for this author.",
            });
        }

        const borrowedBooks = await Reader.find({ borrowedList: { $in: booksByAuthor.map(book => book._id) } })
            .select('borrowedList');

        const borrowedBookIds = borrowedBooks.flatMap(reader => reader.borrowedList);
        const currentlyBorrowedBooks = booksByAuthor.filter(book => borrowedBookIds.includes(book._id));

        res.status(200).json({
            message: "Books retrieved successfully",
            books: booksByAuthor,
            currentlyBorrowedBooks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

export default router;