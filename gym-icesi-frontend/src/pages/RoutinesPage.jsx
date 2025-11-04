import React, { useState, useEffect } from 'react';
import routineService from '../services/routineService';

const RoutinesPage = () => {
  const [routines, setRoutines] = useState([]);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [editingRoutineName, setEditingRoutineName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await routineService.getRoutines();
      setRoutines(response.data);
    } catch (err) {
      setError('Failed to fetch routines');
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      await routineService.createRoutine(newRoutineName);
      setNewRoutineName('');
      fetchRoutines();
    } catch (err) {
      setError('Failed to create routine');
    }
  };

  const handleUpdateRoutine = async (id) => {
    try {
      await routineService.updateRoutine(id, editingRoutineName);
      setEditingRoutineId(null);
      setEditingRoutineName('');
      fetchRoutines();
    } catch (err) {
      setError('Failed to update routine');
    }
  };

  const handleDeleteRoutine = async (id) => {
    try {
      await routineService.deleteRoutine(id);
      fetchRoutines();
    } catch (err) {
      setError('Failed to delete routine');
    }
  };

  return (
    <div>
      <h2>My Routines</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleCreateRoutine}>
        <input
          type="text"
          placeholder="New Routine Name"
          value={newRoutineName}
          onChange={(e) => setNewRoutineName(e.target.value)}
          required
        />
        <button type="submit">Add Routine</button>
      </form>

      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            {editingRoutineId === routine.id ? (
              <>
                <input
                  type="text"
                  value={editingRoutineName}
                  onChange={(e) => setEditingRoutineName(e.target.value)}
                />
                <button onClick={() => handleUpdateRoutine(routine.id)}>Save</button>
                <button onClick={() => setEditingRoutineId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {routine.name}
                <button onClick={() => {
                  setEditingRoutineId(routine.id);
                  setEditingRoutineName(routine.name);
                }}>Edit</button>
                <button onClick={() => handleDeleteRoutine(routine.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinesPage;