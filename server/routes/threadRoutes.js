// server/routes/threadRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import { getThreads, createThread } from '../controllers/threadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateThreadCreation } from '../validations/threadValidation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware to prevent spam (e.g., excessive thread creation)
const createThreadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 thread creation requests per window
    message: 'Too many threads created from this IP, please try again after 15 minutes.',
});

// Get threads - no authentication needed
router.get(
    '/',
    asyncHandler(getThreads) // Handles pagination, search, and filtering
);

// Create thread - requires authentication
router.post(
    '/',
    protect, // Requires user to be authenticated
    createThreadLimiter, // Apply rate limit
    validateThreadCreation, // Validate thread data before creation
    asyncHandler(createThread) // Controller function for thread creation
);

export default router;
