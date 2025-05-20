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
import cors from "cors";
import { config } from "dotenv";
config();
// import { v2 as cloudinary } from "cloudinary";

// // Configuration
// cloudinary.config({
//   cloud_name: "dspd4gvyn",
//   api_key: "386416476746352",
//   api_secret: "YQxdZ3YiBAlxHC_xZxCw1Jwue1Y", // Click 'View API Keys' above to copy your API secret
// });

// app config
const app = express();

// middleware
app.use(cors()); // Enable CORS for all routes
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
