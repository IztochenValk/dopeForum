// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // State for token

    // Load user and token from localStorage when the app initializes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken); // Load token on app start
    }, []);

    // Login function
    const login = (userData) => {
        setUser(userData);
        setToken(userData.token); // Set token in state
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null); // Clear token from state
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context in other components
export const useAuth = () => useContext(AuthContext);
