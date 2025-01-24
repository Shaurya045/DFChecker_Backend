import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://shauryasingh:2411Patna@cluster0.6zqngoq.mongodb.net/dfchecker"
    )
    .then(() => {
      console.log("Database connected.");
    });
};
