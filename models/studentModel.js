import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
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
    rollNo: {
      type: Number,
      required: [true, "Roll No is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    course: {
      type: String,
      required: [true, "Course is Required"],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],  // Role can be 'student' or 'admin'
      default: 'student', // Default role is 'student'
    },
    isStudent: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create the Student model
const Student = mongoose.model("Student", StudentSchema);

export default Student;
