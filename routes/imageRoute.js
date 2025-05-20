import express from "express";
import multer from "multer";
import { listItem, updateItem } from "../controllers/imageController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Add this import

const imageRouter = express.Router();

// Image Storage Engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Add verifyToken middleware before upload
imageRouter.post(
  "/upload-images",
  verifyToken, // Add this authentication middleware
  upload.fields([
    { name: "imageL", maxCount: 1 },
    { name: "imageR", maxCount: 1 },
  ]),
  updateItem
);

imageRouter.post("/list", verifyToken, listItem); // Also protect this route

export default imageRouter;