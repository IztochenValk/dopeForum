// src/components/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';
import LoginDialog from './LoginDialog';
import NotificationSnackbar from './NotificationSnackbar';

const Header = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLoginDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleLoginDialogClose = () => {
        setDialogOpen(false);
    };

    const handleLogout = () => {
        logout();
        setSnackbarMessage('You have logged out successfully.');
        setSnackbarOpen(true);
        handleMenuClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Forum App
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                    {user ? (
                        <>
                            <IconButton onClick={handleMenuOpen} color="inherit">
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <IconButton onClick={handleLoginDialogOpen} color="inherit">
                            <AccountCircle />
                        </IconButton>
                    )}
                    <LoginDialog
                        open={dialogOpen}
                        onClose={handleLoginDialogClose}
                        onRegister={() => {
                            setSnackbarMessage('Registration successful. Welcome!');
                            setSnackbarOpen(true);
                        }}
                        onLogin={() => {
                            setSnackbarMessage('You have logged in successfully.');
                            setSnackbarOpen(true);
                        }}
                    />
                </Box>
                <NotificationSnackbar
                    message={snackbarMessage}
                    open={snackbarOpen}
                    onClose={handleSnackbarClose}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
