// server/utils/tokenUtils.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // Adjust payload as needed
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};
