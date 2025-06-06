import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT and set it in a secure HTTP-only cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expiration set to 1 day
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensures cookie is sent only over HTTPS in production
        sameSite: 'strict', // CSRF protection by limiting cross-site requests
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Password strength validation (example)
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            res.status(400);
            throw new Error('Password must contain at least 8 characters, including uppercase, lowercase, and a number');
        }

        // Hash password and create new user
        const user = await User.create({
            username,
            email,
            password,
        });

        // Generate JWT and set cookie
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    })
);

// @route   POST /api/auth/login
// @desc    Authenticate user and login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Generate JWT and set cookie
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    })
);

// @route   POST /api/auth/logout
// @desc    Logout user and clear cookie
// @access  Private
router.post(
    '/logout',
    asyncHandler(async (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    })
);

export default router;
