// src/components/LoginDialog.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    Tabs,
    Tab,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { registerUser, loginUser } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const LoginDialog = ({ open, onClose }) => {
    const { login } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setFormData({ username: '', email: '', password: '' });
        setError(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let userData;
            if (tabIndex === 0) {
                // Login
                userData = await loginUser({ email: formData.email, password: formData.password });
            } else {
                // Sign Up
                userData = await registerUser(formData);
            }

            if (userData?.token) {
                login(userData); // Store user in context/localStorage
                onClose();
            } else {
                throw new Error("Authentication failed: No token received");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {tabIndex === 0 ? 'Login' : 'Sign Up'}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                </Tabs>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit} key={tabIndex}>
                    {tabIndex === 1 && (
                        <TextField
                            margin="normal"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    )}
                    <TextField
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="normal"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : tabIndex === 0 ? 'Login' : 'Sign Up'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
