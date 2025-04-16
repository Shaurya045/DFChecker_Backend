import Form from "../model/form.model.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const submitForm = async (req, res) => {
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
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { data } = req.body;

    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Create a new form document linked to the user
    const newForm = new Form({
      userId,
      data,
    });

    // Save the form data to the database
    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Form data submitted successfully.",
      form: newForm,
    });
  } catch (error) {
    console.error("Error submitting form data:", error);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again.",
        expiredAt: error.expiredAt
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please login again.",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting form data.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { submitForm };