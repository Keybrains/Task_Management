import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const isAuth = authToken; // Implement more robust logic as needed
  const location = useLocation();

  if (!isAuth) {
    // Redirect to specific login based on the attempted path
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/adminlogin" />;
    } else if (location.pathname.startsWith('/superadmin')) {
      return <Navigate to="/superadminlogin" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

// Define prop types
RequireAuth.propTypes = {
  children: PropTypes.node.isRequired
};

export default RequireAuth;
