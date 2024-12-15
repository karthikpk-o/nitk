import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author", 
        required: [true, "Author is required"],
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
    },
    borrowedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Reader", 
        default: [],
    },
}, {
    timestamps: true,
});

export default mongoose.model("Book", bookSchema);
