import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

// Get the credentials from environment variables
const USERNAME = process.env.DBUSER;
const PASSWORD = process.env.DBPASSWORD;

// Connect to MongoDB using the credentials
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@karthiklibrary.edpfh.mongodb.net/lib`);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
};


export default connectDB;
