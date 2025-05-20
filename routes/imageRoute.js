// imageRoute.js
import express from "express";
import multer from "multer";
import { listItem, updateItem } from "../controllers/imageController.js";

const imageRouter = express.Router();

// Image Storage Engine for Multer
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "uploads/"); // Save uploaded files to the "uploads" directory
  // },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Initialize Multer with the storage engine
const upload = multer({ storage: storage });

// Route to upload images
imageRouter.post(
  "/upload-images",
  upload.fields([
    { name: "imageL", maxCount: 1 }, // Expecting one file for "imageL"
    { name: "imageR", maxCount: 1 }, // Expecting one file for "imageR"
  ]),
  updateItem
);

// Route to list images
imageRouter.post("/list", listItem);

export default imageRouter;