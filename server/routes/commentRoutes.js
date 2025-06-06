import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// @route   POST /api/comments/:threadId
// @desc    Add a comment to a thread
// @access  Private
router.post(
  '/:threadId',
  protect,
  asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content.trim()) {
      res.status(400);
      throw new Error('Content is required');
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      thread: req.params.threadId,
    });

    res.status(201).json(comment);
  })
);

// @route   GET /api/comments/:threadId
// @desc    Get comments for a thread
// @access  Public
router.get(
  '/:threadId',
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ thread: req.params.threadId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.json(comments);
  })
);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment by ID (author or admin only)
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Allow deletion by the comment's author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  })
);

export default router;
