import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>You have been logged out.</h2>
    </div>
  );
}

export default Logout;
