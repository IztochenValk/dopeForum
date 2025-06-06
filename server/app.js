// server/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import threadRoutes from './routes/threadRoutes.js';
import subforumRoutes from './routes/subforumRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import tagRoutes from './routes/tagRoutes.js'; // Import your tags route

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up trust proxy for reverse proxies (e.g., for rate limiting)
app.set('trust proxy', 1);

// Security: Set HTTP headers for security with Helmet
app.use(helmet());

// Enable CORS with credentials support and restrict origins
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Data sanitization against XSS attacks
app.use(xssClean());

// Prevent HTTP parameter pollution
app.use(hpp());

// Cookie parser for handling cookies
app.use(cookieParser());

// Limit requests from the same IP to avoid DDoS or brute-force attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', apiLimiter); // Apply rate limiter to all API routes

// Development logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser to handle JSON payloads
app.use(express.json({ limit: '10kb' }));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve favicon if available
app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/subforums', subforumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tags', tagRoutes); // Use the tags route with the correct prefix

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

// Error handling for non-existing routes
app.use(notFound);
app.use(errorHandler);

export default app;
