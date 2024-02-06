// Redirect.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = ({ to }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return null; // Render nothing
};

export default Redirect; // Export the Redirect component
