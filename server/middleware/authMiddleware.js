import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log("Token received from Authorization header:", token);
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log("Token received from cookies:", token);
    }

    if (!token) {
        console.log("No token provided. Access denied.");
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log("User not found for the decoded ID:", decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        console.log("User found and attached to req.user:", req.user);

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: 'Not authorized, token failed verification' });
    }
};

// Middleware to authorize admin-only routes
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log("Access denied. User is not an admin.");
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
