// server.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js'; // Import the app configuration

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file with specified path
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Check if JWT_SECRET and other env variables are loaded
console.log("Environment JWT_SECRET:", process.env.JWT_SECRET);
console.log("Environment MONGO_URI:", process.env.MONGO_URI);

// Validate that JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in .env file.");
    process.exit(1); // Stop the server if JWT_SECRET is missing
}

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
