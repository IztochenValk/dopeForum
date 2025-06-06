import { body, validationResult } from 'express-validator';

// Validation rules
export const validateThreadCreation = [
    body('title').isString().isLength({ min: 5, max: 100 }).trim().escape().withMessage('Title must be between 5 and 100 characters'),
    body('content').isString().isLength({ min: 20, max: 5000 }).trim().escape().withMessage('Content must be between 20 and 5000 characters'),
    body('subforum').isMongoId().withMessage('Invalid subforum ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
