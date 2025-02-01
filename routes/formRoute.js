import express from "express";
import { submitForm } from "../controllers/formController.js";

const formRouter = express.Router();

formRouter.post("/submit-form", submitForm);

export default formRouter;
