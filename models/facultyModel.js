import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    teacherId: {
      type: String,
      required: [true, "Teacher ID is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      enum: ['faculty', 'admin'],  // Added role property for RBAC
      default: 'faculty', // Default role is 'faculty'
    },
    isFaculty: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Changed the model name to "Faculty" to match the schema
const Faculty = mongoose.model("Faculty", FacultySchema);

export default Faculty;
