// server/controllers/subforumController.js
import asyncHandler from 'express-async-handler';
import Subforum from '../models/Subforum.js';

export const getSubforums = asyncHandler(async (req, res) => {
    const subforums = await Subforum.find({});
    res.json(subforums);
});
