import React, { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import routineService from '../services/routineService';
import { useAuth } from '../context/AuthContext';

const ProgressPage = () => {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRoutines();
  }, []);

  useEffect(() => {
    if (selectedRoutine) {
      fetchProgress(selectedRoutine);
    }
  }, [selectedRoutine]);

  const fetchRoutines = async () => {
    try {
      const response = await routineService.getRoutines();
      setRoutines(response.data);
      if (response.data.length > 0) {
        setSelectedRoutine(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch routines');
    }
  };

  const fetchProgress = async (routineId) => {
    try {
      const response = await progressService.getProgressByRoutine(routineId);
      setProgressData(response.data);
    } catch (err) {
      setError('Failed to fetch progress data');
    }
  };

  return (
    <div>
      <h2>My Progress</h2>
      {error && <p>{error}</p>}

      <div>
        <label>Select Routine:</label>
        <select
          value={selectedRoutine}
          onChange={(e) => setSelectedRoutine(e.target.value)}
        >
          {routines.map((routine) => (
            <option key={routine.id} value={routine.id}>
              {routine.name}
            </option>
          ))}
        </select>
      </div>

      {progressData.length > 0 ? (
        <ul>
          {progressData.map((progress) => (
            <li key={progress.id}>
              Date: {new Date(progress.date).toLocaleDateString()},
              Reps: {progress.reps},
              Time: {progress.time},
              Effort: {progress.effort}
            </li>
          ))}
        </ul>
      ) : (
        <p>No progress data available for this routine.</p>
      )}
    </div>
  );
};

export default ProgressPage;