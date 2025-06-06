// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    // Set the default status code to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(statusCode).json({
        message: err.message,
        // Provide stack trace only in development for debugging purposes
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

// Middleware to handle 404 errors
const notFound = (req, res, next) => {
    // Ignore requests for hot-update.json files (used in frontend hot-reloading)
    if (req.path.endsWith('.hot-update.json')) {
        return res.status(204).end(); // No Content
    }

    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export { errorHandler, notFound };
