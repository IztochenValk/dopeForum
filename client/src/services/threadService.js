import axios from 'axios';

const API_URL = '/api/threads';

// Fetch all threads with optional subforum filter
export const fetchThreads = async (subforum = '') => {
    const response = await axios.get(API_URL, {
        params: { subforum }, // Send the subforum as a query param
        withCredentials: true
    });
    return response.data;
};


// Fetch a specific thread by ID
export const fetchThreadById = async (threadId) => {
    const response = await axios.get(`${API_URL}/${threadId}`, { withCredentials: true });
    return response.data;
};

// Report a thread
export const reportThread = async (threadId, reason) => {
    const response = await axios.post('/api/reports', { threadId, reason }, { withCredentials: true });
    return response.data;
};

// Create a new thread
// threadService.js
export const createThread = async (threadData, token) => {
    console.log("Sending token in request:", token);
    try {
        const response = await axios.post('/api/threads', threadData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating thread:", error);
        throw error;
    }
};


// Fetch available tags for threads
export const fetchTags = async () => {
    try {
        const response = await axios.get('/api/tags', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};
