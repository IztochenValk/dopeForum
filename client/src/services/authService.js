import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Username, email, and password are required');
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log("User with email already exists:", email);
        res.status(400);
        throw new Error('User already exists');
    }

    // Log the plain password before hashing
    console.log("Plain password before hashing:", password);

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Log the hashed password
    console.log("Hashed password after bcrypt:", hashedPassword);

    // Create the user with the hashed password
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        console.log("User created successfully with hashed password:", user.password);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Authenticate a user
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        console.log("No user found for email:", email);
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPasswordCorrect); // Log the password match status

    if (isPasswordCorrect) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        console.log("Invalid password for user:", email);
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
