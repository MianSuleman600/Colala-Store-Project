// src/routes/ProtectedRoute.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { openModal } from '../redux/modalSlice';

/**
 * ProtectedRoute Component
 * A wrapper component that protects routes. If the user is not logged in,
 * it opens the login modal instead of redirecting.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The components to render if the user is authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth status from Redux

    if (!isAuthenticated) {
        // If not logged in, open the login modal and redirect to home
        dispatch(openModal('login'));
        return <Navigate to="/" replace />;
    }

    // If logged in, render the protected children components
    return children;
};

export default ProtectedRoute;