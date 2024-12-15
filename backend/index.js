import express from "express";
import RootRouter from "./routes/index.js"
import connectDB from "./db.js";

const app = express();
connectDB();
const PORT = 3000;
app.use(express.json());

app.use("/api/v1", RootRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})