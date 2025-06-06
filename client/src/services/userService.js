// client/src/services/userService.js
import axios from 'axios';

const API_URL = '/api/users';

// Fetch user profile
export const fetchProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
    return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, { withCredentials: true });
    return response.data;
};

// Upload avatar
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// Register a new user
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
    });

    const userDataResponse = response.data;

    // Store token and user data in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    localStorage.setItem('token', userDataResponse.token); // Store token for thread creation

    return userDataResponse;
};

// Login an existing user
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData, {
        headers: { 'Content-Type': 'application/json' },
    });

    const userDataResponse = response.data;

    // Store token and user data in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    localStorage.setItem('token', userDataResponse.token); // Store token for thread creation

    return userDataResponse;
};

// Logout the user
export const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};
