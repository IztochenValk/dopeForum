import axios from 'axios';

const API_URL = '/api/threads';

// Fetch all threads with an optional subforum filter
export const fetchThreads = async (subforumId) => {
    const response = await axios.get(API_URL, {
        params: { subforum: subforumId }, // Pass subforum ID as a query param
    });
    return response.data;
};

// Fetch tags for threads
export const fetchTags = async () => {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
};

// Fetch available subforums
export const fetchSubforums = async () => {
    const response = await axios.get('/api/subforums');
    return response.data;
};

// Create a new thread
export const createThread = async (threadData, token) => {
    console.log("Sending token in request:", token); // Debugging log

    try {
        const response = await axios.post(API_URL, threadData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating thread:", error);
        throw error;
    }
};
