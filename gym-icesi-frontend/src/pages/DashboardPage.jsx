import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <p>Welcome, {user.user.email}!</p>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
};

export default DashboardPage;