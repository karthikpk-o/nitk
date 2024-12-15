import express from "express";
import userRouter from "./user.js"
import bookRouter from "./books.js"
import readerRouter from "./reader.js"

const router = express.Router();

router.use("/users", userRouter);
router.use("/books", bookRouter);
router.use("/reader", readerRouter);

export default router;