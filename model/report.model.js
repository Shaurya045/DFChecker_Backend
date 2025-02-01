import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Link each report to a specific user
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true, // Link report to a specific form submission
  },
  result: {
    type: Object,
    required: true, // Store the generated report result
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
