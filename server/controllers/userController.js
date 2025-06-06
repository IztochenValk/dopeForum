import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Username, email, and password are required');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log("User with email already exists:", email);
        res.status(400);
        throw new Error('User already exists');
    }

    console.log("Plain password at registration:", password);

    // Save the user without manual hashing, as the pre-save hook will hash it
    const user = await User.create({
        username,
        email,
        password, // Plain password is saved; pre-save hook will hash it
    });

    if (user) {
        console.log("User registered successfully with hashed password:", user.password);
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
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("Received login request for email:", email);
    console.log("Plain password for login:", password);

    if (!email || !password) {
        console.log("Email or password missing in the request.");
        res.status(400);
        throw new Error('Email and password are required');
    }

    // Find user and retrieve password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        console.log("No user found with email:", email);
        res.status(401);
        throw new Error('Invalid email or password');
    }


    console.log("Retrieved hashed password from DB:", user.password);

    // Only use bcrypt.compare to check if passwords match
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("bcrypt.compare result:", isPasswordCorrect);

    if (isPasswordCorrect) {
        console.log("Authentication successful for user:", email);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        console.log("Authentication failed. Password does not match for user:", email);
        res.status(401);
        throw new Error('Invalid email or password');

    }
});

// Upload a user avatar
const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
});

export { registerUser, authUser, uploadAvatar };
