// src/components/NotificationSnackbar.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ message, open, onClose, severity = 'success' }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;
