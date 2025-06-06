// /client/src/services/adminService.js
import axios from 'axios';

const API_URL = '/api/admin';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensure cookies are sent with requests
});

api.interceptors.request.use(
    (config) => {
        // Attach CSRF token if available (for additional security)
        const csrfToken = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('csrfToken='));
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken.split('=')[1];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const deleteThread = async (threadId) => {
    await api.delete(`/threads/${threadId}`);
};


export const fetchReports = () => {
    // Placeholder implementation for fetchReports
};

export const resolveReport = () => {
    // Placeholder implementation for resolveReport
};

export const lockThread = () => {
    // Placeholder implementation for lockThread
};