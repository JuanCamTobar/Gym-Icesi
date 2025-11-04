import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';

const ReportsPage = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [trainerPerformance, setTrainerPerformance] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const topUsersResponse = await reportService.getTopUsers();
      setTopUsers(topUsersResponse.data);
      const trainerPerformanceResponse = await reportService.getTrainerPerformance();
      setTrainerPerformance(trainerPerformanceResponse.data);
    } catch (err) {
      setError('Failed to fetch reports');
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      {error && <p>{error}</p>}

      <h3>Top Users</h3>
      {/* Display top users here */}

      <h3>Trainer Performance</h3>
      {/* Display trainer performance here */}
    </div>
  );
};

export default ReportsPage;
