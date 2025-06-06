// server/routes/tagRoutes.js
import express from 'express';
const router = express.Router();

// A mock route to get tags as objects with `id` and `name`
router.get('/', (req, res) => {
    const tags = [
        { id: '1', name: 'tag1' },
        { id: '2', name: 'tag2' },
        { id: '3', name: 'tag3' }
    ]; // Example tags with unique IDs and names
    res.json(tags);
});

export default router;
