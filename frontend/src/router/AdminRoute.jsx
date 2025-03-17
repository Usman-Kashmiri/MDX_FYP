import React from 'react'
import { UseGetRole, useAuth } from '../hooks/auth';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({Component}) => {
    const isAuthenticated = useAuth();
    const role = UseGetRole()
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    } else {
        if (role === "SuperAdmin" || role === "Admin") {
            return <Component />;
        } else {
            return <Navigate to="/not-found" />;
        }
    }
}

export default AdminRoute