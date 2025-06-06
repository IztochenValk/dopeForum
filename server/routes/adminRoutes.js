import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Thread from '../models/Thread.js';

const router = express.Router();

// Pagination defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private/Admin
router.get(
    '/users',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            User.find()
                .select('-password -resetPasswordToken -resetPasswordExpires')
                .skip(skip)
                .limit(limit),
            User.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                totalItems: totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    })
);

// @route   GET /api/admin/threads
// @desc    Get all threads with pagination
// @access  Private/Admin
router.get(
    '/threads',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [threads, totalThreads] = await Promise.all([
            Thread.find().skip(skip).limit(limit),
            Thread.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: threads,
            pagination: {
                totalItems: totalThreads,
                currentPage: page,
                totalPages: Math.ceil(totalThreads / limit),
            },
        });
    })
);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user by ID
// @access  Private/Admin
router.delete(
    '/users/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        await user.remove();
        res.status(200).json({ success: true, message: 'User removed successfully' });
    })
);

// @route   DELETE /api/admin/threads/:id
// @desc    Delete a thread by ID
// @access  Private/Admin
router.delete(
    '/threads/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const thread = await Thread.findById(req.params.id);

        if (!thread) {
            res.status(404);
            throw new Error('Thread not found');
        }

        await thread.remove();
        res.status(200).json({ success: true, message: 'Thread deleted successfully' });
    })
);

export default router;
