// src/routes/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * A wrapper component that protects routes. If the user is not logged in,
 * it redirects them to the login page.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The components to render if the user is authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Get login status from Redux

    if (!isLoggedIn) {
        // If not logged in, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the protected children components
    return children;
};

export default ProtectedRoute;