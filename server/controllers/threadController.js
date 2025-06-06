import asyncHandler from 'express-async-handler';
import Thread from '../models/Thread.js';

export const createThread = asyncHandler(async (req, res) => {
    const { title, content, subforum, tags } = req.body;

    try {
        const newThread = await Thread.create({
            title,
            content,
            subforum,
            tags,
            creator: req.user._id,
        });

        if (newThread) {
            res.status(201).json(newThread);
        } else {
            res.status(400);
            throw new Error('Failed to create thread');
        }
    } catch (error) {
        console.error("Error creating thread:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export const getThreads = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, tag, subforum } = req.query;
    const filter = {};

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }
    if (tag) {
        filter.tags = tag;
    }
    if (subforum) {
        filter.subforum = subforum;
    }

    const threads = await Thread.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('subforum', 'name');

    const totalThreads = await Thread.countDocuments(filter);
    const totalPages = Math.ceil(totalThreads / limit);

    res.json({ threads, totalPages, currentPage: page });
});

