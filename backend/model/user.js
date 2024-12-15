import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
});

const User = mongoose.model('User', userSchema);

const authorSchema = new mongoose.Schema({
    writtenList: {
        type: [String],
        default: [],
    },
});

const readerSchema = new mongoose.Schema({
    borrowedList: {
        type: [String],
        default: [],
    },
});

const Author = User.discriminator('Author', authorSchema);
const Reader = User.discriminator('Reader', readerSchema);


export { User, Author, Reader };