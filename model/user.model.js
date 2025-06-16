import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  imageL: String,
  imageR: String,
});
const User = mongoose.model("User", userSchema);
export default User;
