import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Author, Reader, User} from "../model/user.js"
import authenticateUser from '../middleware.js';
import express from "express"

const router = express.Router();

router.get("/session/validate", authenticateUser, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided. Please log in again.",
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token. Please log in again.",
                });
            }

            res.status(200).json({
                message: "Session is valid",
                user: {
                    id: decoded.id,
                    role: decoded.role,
                },
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while validating the session.",
        });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required: name, email, password"
            });
        }

        if (role !== "author" && role !== "reader") {
            return res.status(400).json({
                message: "Invalid role. Role must be 'author' or 'reader'.",
            });
        }

        const existingUser = role === "author" ? await Author.findOne({ email }) : await Reader.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists, please login"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === "author") {
            user = await Author.create({
                name,
                email,
                password: hashedPassword,
                writtenList: [],
            });
        } else if (role === "reader") {
            user = await Reader.create({
                name,
                email,
                password: hashedPassword,
                borrowedList: [],
            });
        }

        const token = jwt.sign({ userId: user._id, userType: user.__t }, process.env.JWT_SECRET, { expiresIn: '15d' });

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.__t,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required: email and password",
            });
        }

        let user = await Author.findOne({ email });
        
        if (!user) {
            user = await Reader.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please check your email.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials. Please check your email and password.",
            });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.__t },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.__t, 
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/update/:id", authenticateUser, async (req, res) => {
    try {
        const { name, password } = req.body;
        const userId = req.params.id;

        if (req.user.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to update this user's details.",
            });
        }

        let user = await Author.findById(userId);
        if (!user) {
            user = await Reader.findById(userId);
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const updates = {};
        if (name) {
            updates.name = name;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(400).json({
                message: "Error updating user details.",
            });
        }

        res.status(200).json({
            message: "User details updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.__t,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error.",
            error: error.message,
        });
    }
});

router.delete("/delete/:id", authenticateUser, async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user.userId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this user's account.",
            });
        }

        let user = await Author.findById(userId);
        if (!user) {
            user = await Reader.findById(userId);
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        if (user instanceof Author) {
            await Author.findByIdAndDelete(userId);
        } else if (user instanceof Reader) {
            await Reader.findByIdAndDelete(userId);
        }

        res.status(200).json({
            message: "User account deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error.",
            error: error.message,
        });
    }
});


export default router;