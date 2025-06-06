// client/src/services/tagService.js
import axios from 'axios';

export const fetchTags = async () => {
    const response = await axios.get('/api/tags', { withCredentials: true });
    return response.data; // Ensure this matches the format returned by your API
};
