import Student from './../models/studentModel.js';
import { comparePassword, hashedPassword } from '../utils/passwordHash.js';
import jwt from 'jsonwebtoken';

const MAX_AGE = '1hr';  // Set max age for the token

// Student Login
export const login = async (req, res, next) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Validate if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter both email and password', status: false });
        }

        // Look for a student with the given email
        const student = await Student.findOne({ email });

        // If no student is found, return an error message
        if (!student) {
            return res.status(400).json({ message: 'Student not found', status: false });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await comparePassword(password, student.password);

        // If the passwords do not match, return an error message
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password', status: false });
        }

        // Exclude the password from the student object before sending the response
        const { password: pass, ...user } = student.toObject();

        // Set JWT Tokens 
        const user_token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
        const role_token = jwt.sign({ role: student.role }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });

        // Return the user object and JWT tokens in the response
        res
            .cookie('user_token', user_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .cookie('role_token', role_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .status(200)
            .json({ user, status: true });
    } catch (error) {
        next(error.message); // Pass error to error handling middleware
    }
}

// Student SignUp
export const signup = async (req, res, next) => {
    console.log(req.body)
    try {
        // Extract necessary fields from the request body
        const { firstName, lastName, email, password, course, rollNo, role } = req.body;

        // Validate all required fields
        if (!firstName || !lastName || !email || !password || !course || !rollNo || !role) {
            return res.status(400).json({ message: 'Please provide all required fields', status: false });
        }

        // Check if the email is already taken
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Email already in use', status: false });
        }

        // Check if the roll number is already taken
        const existingRollNo = await Student.findOne({ rollNo });
        if (existingRollNo) {
            return res.status(400).json({ message: 'Roll Number already in use', status: false });
        }

        // Hash the password before saving
        const hashedPass = await hashedPassword(password);

        // Create a new student object with the required properties
        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: hashedPass,
            course,
            rollNo,
            role, // Set the role (either 'student' or 'admin')
            isStudent: true, // Set isStudent property to true
        });

        // Save the student to the database
        await newStudent.save();

        // Respond with the newly created student data (excluding password)
        const { password: pass, ...user } = newStudent.toObject();

        // Set JWT Tokens for the newly signed-up user
        const user_token = jwt.sign({ id: newStudent.id }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
        const role_token = jwt.sign({ role: newStudent.role }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });

        // Set the JWT tokens as cookies and send the response
        res
            .cookie('user_token', user_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .cookie('role_token', role_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .status(201)
            .json({ user, status: true });

    } catch (error) {
        next(error.message); // Pass error to error handling middleware
    }
}

// Get Data
export const getData = async (req, res, next) => {
    try {
        // Get role from the request (this should be set by VerifyRole middleware)
        const { role } = req;

        // Check if role exists (it should be set by the VerifyRole middleware)
        if (!role) {
            return res.status(401).json({ message: "Unauthorized: Role not found", status: false });
        }

        // Check if role is 'admin' or 'student' (you can modify this logic as per your requirements)
        console.log(role)
        if (role !== 'admin' && role !== 'student') {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions", status: false });
        }

        // If authorized, proceed with returning data or allowing access
        res.status(200).json({ message: "Allowed Route or Data", status: true });

    } catch (error) {
        // If an error occurs during execution, pass it to the error handling middleware
        next(error.message);
    }
}

