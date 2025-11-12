import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "gofest";

export const connectDB = async () => {
  try {
    let uri = MONGODB_URL.trim().replace(/[<>]/g, "");
    
    if (uri.includes("mongodb+srv://")) {
      if (uri.endsWith("/") || uri.match(/\/\?/)) {
        uri = uri.replace(/\/(\?|$)/, `/${DATABASE_NAME}$1`);
      } else if (!uri.includes(`/${DATABASE_NAME}`) && !uri.match(/\/[^?]+/)) {
        const hasQuery = uri.includes("?");
        uri = hasQuery 
          ? uri.replace("?", `/${DATABASE_NAME}?`)
          : `${uri}/${DATABASE_NAME}`;
      }
      
      if (!uri.includes("retryWrites=true")) {
        uri += uri.includes("?") ? "&retryWrites=true&w=majority" : "?retryWrites=true&w=majority";
      }
    } else {
      if (!uri.includes(`/${DATABASE_NAME}`)) {
        uri = uri.endsWith("/") ? `${uri}${DATABASE_NAME}` : `${uri}/${DATABASE_NAME}`;
      }
    }
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`Connected to MongoDB: ${DATABASE_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};
