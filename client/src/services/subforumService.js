// client/src/services/subforumService.js
import axios from 'axios';

const API_URL = '/api/subforums';

// Fetch all subforums
export const fetchSubforums = async () => {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
};
