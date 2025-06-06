// server/routes/subforumRoutes.js
import express from 'express';
import Subforum from '../models/Subforum.js';
import { getSubforums } from '../controllers/subforumController.js';

const router = express.Router();

// @route   GET /api/subforums
// @desc    Get all subforums
// @access  Public
router.get('/', async (req, res) => {
    try {
        const subforums = await Subforum.find();
        res.json(subforums);
    } catch (error) {
        console.error('Error fetching subforums:', error);
        res.status(500).json({ message: 'Error fetching subforums' });
    }
});

export default router;
