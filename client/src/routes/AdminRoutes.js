import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = ({ isAuthenticated, isAdmin }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/" />;
    return <Outlet />;
};

export default AdminRoutes;
