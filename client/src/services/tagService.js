// src/services/threadService.js or tagService.js
import axios from 'axios';

export const fetchTags = async () => {
    try {
        const response = await axios.get('/api/tags', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};
