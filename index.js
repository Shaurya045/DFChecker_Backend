import express from "express";
import { connectDB } from "./config/db.js";
import imageRouter from "./routes/imageRoute.js";
import userRouter from "./routes/userRoute.js";
import formRouter from "./routes/formRoute.js";
import reportRouter from "./routes/reportRoute.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { config } from "dotenv";
config();

// app config
const app = express();

// middleware
app.use(express.json());

// db connection
connectDB();

// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// api endpoints
app.use("/api", imageRouter);
app.use("/api", userRouter);
app.use("/api", formRouter);
app.use("/api", reportRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
