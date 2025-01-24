import User from "../model/user.model.js";
import fs from "fs";
import jwt from "jsonwebtoken";

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

  const imageL_filename = req.files.imageL[0].filename; // Assuming `imageL` is an array
  const imageR_filename = req.files.imageR[0].filename; // Assuming `imageR` is an array

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // Update the user with the new images
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        imageL: imageL_filename,
        imageR: imageR_filename,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "Images updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Invalid or expired token.",
      });
    }
    console.error("Error updating images:", error);
    res.status(500).json({
      success: false,
      message: "Error updating images.",
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
    const userImages = {
      ...user._doc, // Spread all user document fields
      imageL: user.imageL
        ? `${req.protocol}://${req.get("host")}/uploads/${user.imageL}`
        : null, // Handle cases where imageL might be missing
      imageR: user.imageR
        ? `${req.protocol}://${req.get("host")}/uploads/${user.imageR}`
        : null, // Handle cases where imageR might be missing
    };

    // Respond with the user's image data
    res.status(200).json({
      success: true,
      message: "User images retrieved successfully.",
      data: userImages,
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
