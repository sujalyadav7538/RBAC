import Faculty from './../models/facultyModel.js';
import { comparePassword, hashedPassword } from '../utils/passwordHash.js';
import jwt from 'jsonwebtoken';

const MAX_AGE = '1hr';
// Faculty login
export const login = async (req, res, next) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Validate if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter both email and password', status: false });
        }

        // Look for a faculty member with the given email
        const faculty = await Faculty.findOne({ email });

        // If no faculty member is found, return an error message
        if (!faculty) {
            return res.status(400).json({ message: 'Faculty not found', status: false });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await comparePassword(password, faculty.password);

        // If the passwords do not match, return an error message
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password', status: false });
        }

        // Exclude the password from the faculty object before sending the response
        const { password: pass, ...user } = faculty.toObject();

        // Set JWT Tokens for the faculty user
        const user_token = jwt.sign({ id: faculty.id }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
        const role_token = jwt.sign({ role: faculty.role }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });

        // Set the JWT tokens as cookies
        res
            .cookie('user_token', user_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .cookie('role_token', role_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .status(200)
            .json({ user, status: true });

    } catch (error) {
        // Pass any error to error handling middleware
        next(error.message);
    }
}

// Faculty signup
export const signup = async (req, res, next) => {
    try {
        // Extract necessary fields from the request body
        const { firstName, lastName, email, password, teacherId, department, role } = req.body;

        // Validate all required fields
        if (!firstName || !lastName || !email || !password || !teacherId || !department || !role) {
            return res.status(400).json({ message: 'Please provide all required fields', status: false });
        }

        // Check if the email is already taken
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: 'Email already in use', status: false });
        }

        // Check if the teacher ID is already taken
        const existingTeacherId = await Faculty.findOne({ teacherId });
        if (existingTeacherId) {
            return res.status(400).json({ message: 'Teacher ID already in use', status: false });
        }

        // Hash the password before saving
        const hashedPass = await hashedPassword(password);

        // Create a new faculty object
        const newFaculty = new Faculty({
            firstName,
            lastName,
            email,
            password: hashedPass,
            teacherId,
            department,
            role, // Set the role for the faculty (e.g., 'faculty', 'admin')
            isFaculty: true, // Set isFaculty property to true
        });

        // Save the faculty to the database
        await newFaculty.save();

        // Exclude the password from the faculty object before sending the response
        const { password: pass, ...user } = newFaculty.toObject();

        // Set JWT Tokens for the newly signed-up faculty
        const user_token = jwt.sign({ id: newFaculty.id }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
        const role_token = jwt.sign({ role: newFaculty.role }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });

        // Set the JWT tokens as cookies and respond
        res
            .cookie('user_token', user_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .cookie('role_token', role_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 1000) })
            .status(201)
            .json({ user, status: true });

    } catch (error) {
        // Pass any error to error handling middleware
        next(error.message);
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
        if (role !== 'admin' && role !== 'faculty') {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions", status: false });
        }

        // If authorized, proceed with returning data or allowing access
        res.status(200).json({ message: "Allowed Route or Data", status: true });

    } catch (error) {
        // If an error occurs during execution, pass it to the error handling middleware
        next(error.message);
    }
}