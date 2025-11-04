import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
      <ul>
        <li>
          <Link to="/admin/users">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/trainers">Manage Trainers</Link>
        </li>
        <li>
          <Link to="/admin/statistics">View Statistics</Link>
        </li>
        <li>
          <Link to="/admin/reports">View Reports</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminPage;