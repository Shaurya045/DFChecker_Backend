import User from "../model/user.model.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// addItem
const updateItem = async (req, res) => {
  // Ensure `req.files` is used for multiple file uploads (imageL and imageR)
  if (!req.files || !req.files.imageL || !req.files.imageR) {
    return res.status(400).json({
      success: false,
      message: "Both images (imageL and imageR) are required.",
    });
  }

  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // Upload images to Cloudinary
    const uploadToCloudinary = async (file) => {
      return await cloudinary.uploader.upload(file.path, {
        folder: "user_uploads",
      });
    };

    const imageLUpload = await uploadToCloudinary(req.files.imageL[0]);
    const imageRUpload = await uploadToCloudinary(req.files.imageR[0]);

    // Update the user with the new image URLs
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        imageL: imageLUpload.secure_url,
        imageR: imageRUpload.secure_url,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "Images uploaded successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading images.",
    });
  }
};

// listItem
const listItem = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and decode the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user data based on the token's user ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Construct absolute URLs for the user's images
    // const userImages = {
    //   ...user._doc, // Spread all user document fields
    //   imageL: user.imageL
    //     ? `${req.protocol}://${req.get("host")}/uploads/${user.imageL}`
    //     : null, // Handle cases where imageL might be missing
    //   imageR: user.imageR
    //     ? `${req.protocol}://${req.get("host")}/uploads/${user.imageR}`
    //     : null, // Handle cases where imageR might be missing
    // };

    // Respond with the user's image data
    res.status(200).json({
      success: true,
      message: "User images retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user images:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user images.",
    });
  }
};

export { updateItem, listItem };
