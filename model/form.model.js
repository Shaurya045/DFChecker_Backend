import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Link each form submission to a specific user
  },
  data: {
    type: Object,
    required: true, // Store the form data as an object
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

const Form = mongoose.model("Form", formSchema);
export default Form;
