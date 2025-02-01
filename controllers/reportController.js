import User from "../model/user.model.js";
import Form from "../model/form.model.js";
import jwt from "jsonwebtoken";
import { makeReport } from "../utils/report.js";

const generateReport = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  // console.log(userId);
  try {
    const form = await Form.findOne({ userId });
    // console.log(form);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form data not found.",
      });
    }
    // console.log(form.data);
    const report = makeReport(form.data);
    res.json({
      success: true,
      message: "Report generated successfully.",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the report.",
    });
  }
};

export { generateReport };
