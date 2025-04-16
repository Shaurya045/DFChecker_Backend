import Report from "../model/report.model.js";
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
    // Get the most recent form submitted by the user
    const recentForm = await Form.findOne({ userId }).sort({ createdAt: -1 });
    console.log(" fffff"+ recentForm);
    if (!recentForm) {
      return res.status(404).json({
        success: false,
        message: "Form data not found.",
      });
    }
    // console.log(form.data);
    // Generate the report from form data
    const reportData = makeReport(recentForm.data);
    // console.log("report data" + reportData);

    // Save the generated report in the database
    const newReport = new Report({
      userId,
      formId: recentForm._id,
      result: reportData,
    });

    await newReport.save();
    // pconsole.log("nnnnnnn" + newReport);

    res.json({
      success: true,
      message: "Report generated and saved successfully.",
      data: newReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating and saving the report.",
    });
  }
};

// Get all reports for the authenticated user.
const getAllReportsByUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing or invalid.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch all reports for the user
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .populate("formId"); // Optional: Populate the form data

    if (!reports.length) {
      return res.status(404).json({
        success: false,
        message: "No reports found for this user.",
      });
    }

    res.json({
      success: true,
      message: "Reports retrieved successfully.",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching reports.",
    });
  }
};

export { generateReport, getAllReportsByUser };
