import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import Report from '../models/Report.js';
import Thread from '../models/Thread.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    Report a thread
// @access  Private
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { threadId, reason } = req.body;

        // Check if thread exists
        const thread = await Thread.findById(threadId);
        if (!thread) {
            res.status(404);
            throw new Error('Thread not found');
        }

        // Check if report already exists
        const existingReport = await Report.findOne({ thread: threadId, reporter: req.user._id });
        if (existingReport) {
            res.status(400);
            throw new Error('You have already reported this thread');
        }

        const report = await Report.create({
            thread: threadId,
            reporter: req.user._id,
            reason,
        });

        res.status(201).json(report);
    })
);

// @route   GET /api/reports
// @desc    Get all reports (admin only)
// @access  Private/Admin
router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const reports = await Report.find({ status: 'pending' })
            .populate('thread', 'title content')
            .populate('reporter', 'username email');

        res.json(reports);
    })
);

// @route   PATCH /api/reports/:id/resolve
// @desc    Mark a report as resolved
// @access  Private/Admin
router.patch(
    '/:id/resolve',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        report.status = 'resolved';
        await report.save();

        res.json({ message: 'Report marked as resolved' });
    })
);

// @route   DELETE /api/reports/:id
// @desc    Delete a report by ID
// @access  Private/Admin
router.delete(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        await report.remove();

        res.json({ message: 'Report deleted successfully' });
    })
);

export default router;
