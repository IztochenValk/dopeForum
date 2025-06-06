// server/validations/threadValidation.js
import Joi from 'joi';
import xss from 'xss';

// Joi schema for validating thread creation
const threadSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().trim()
        .messages({
            'string.base': 'Title should be a type of text',
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of 3 characters',
            'string.max': 'Title should not exceed 100 characters',
            'any.required': 'Title is required',
        }),
    content: Joi.string().min(10).max(2000).required().trim()
        .messages({
            'string.base': 'Content should be a type of text',
            'string.empty': 'Content cannot be empty',
            'string.min': 'Content should have a minimum length of 10 characters',
            'string.max': 'Content should not exceed 2000 characters',
            'any.required': 'Content is required',
        }),
    subforum: Joi.string().optional().allow(null)
        .messages({
            'any.required': 'Subforum is required if tags are not provided',
        }),
    tags: Joi.array().items(Joi.string().trim()).optional()
        .messages({
            'string.base': 'Each tag should be a type of text',
        }),
}).or('subforum', 'tags'); // Require at least one of subforum or tags

// Middleware for validating thread creation
export const validateThreadCreation = (req, res, next) => {
    // Validate the request body against the Joi schema
    const { error } = threadSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Sanitize fields to prevent XSS attacks
    req.body.title = xss(req.body.title);
    req.body.content = xss(req.body.content);
    if (req.body.tags) {
        req.body.tags = req.body.tags.map(tag => xss(tag));
    }

    // Proceed if validation is successful
    next();
};
