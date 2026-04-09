// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;