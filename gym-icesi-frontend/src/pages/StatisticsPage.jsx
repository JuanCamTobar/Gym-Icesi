import React, { useState } from 'react';
import statisticsService from '../services/statisticsService';

const StatisticsPage = () => {
  const [userStats, setUserStats] = useState([]);
  const [trainerStats, setTrainerStats] = useState([]);
  const [month, setMonth] = useState('1'); // Default to January
  const [error, setError] = useState('');

  const fetchStatistics = async () => {
    try {
      const userResponse = await statisticsService.getUserStatistics(month);
      setUserStats(userResponse.data);
      const trainerResponse = await statisticsService.getTrainerStatistics(month);
      setTrainerStats(trainerResponse.data);
    } catch (err) {
      setError('Failed to fetch statistics');
    }
  };

  return (
    <div>
      <h2>Statistics</h2>
      {error && <p>{error}</p>}
      <div>
        <label>Select Month:</label>
        <input
          type="number"
          min="1"
          max="12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={fetchStatistics}>Fetch Statistics</button>
      </div>

      <h3>User Statistics</h3>
      {/* Display user stats here */}

      <h3>Trainer Statistics</h3>
      {/* Display trainer stats here */}
    </div>
  );
};

export default StatisticsPage;
