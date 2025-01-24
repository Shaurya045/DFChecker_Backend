import express from "express";
import multer from "multer";
import { listItem, updateItem } from "../controllers/imageController.js";

const imageRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

imageRouter.post(
  "/upload-images",
  upload.fields([
    { name: "imageL", maxCount: 1 }, // Expecting one file for "imageL"
    { name: "imageR", maxCount: 1 }, // Expecting one file for "imageR"
  ]),
  updateItem
);

imageRouter.post("/list", listItem);

// foodRouter.post("/remove", removeItem);

export default imageRouter;
