import express from "express";
import {
  generateReport,
  getAllReportsByUser,
} from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.post("/getreport", generateReport); // Generate and save report
reportRouter.post("/getallreports", getAllReportsByUser); // Fetch all reports for the user

export default reportRouter;
