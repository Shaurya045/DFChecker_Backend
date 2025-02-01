import express from "express";
import { generateReport } from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.post("/getreport", generateReport);

export default reportRouter;
