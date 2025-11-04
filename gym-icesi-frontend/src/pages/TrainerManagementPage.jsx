import React, { useState, useEffect } from 'react';
import trainerService from '../services/trainerService';

const TrainerManagementPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getTrainers();
      setTrainers(response.data);
    } catch (err) {
      setError('Failed to fetch trainers');
    }
  };

  const handleDeleteTrainer = async (id) => {
    try {
      await trainerService.deleteTrainer(id);
      fetchTrainers();
    } catch (err) {
      setError('Failed to delete trainer');
    }
  };

  return (
    <div>
      <h2>Trainer Management</h2>
      {error && <p>{error}</p>}
      {/* Add trainer creation and update forms here */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer.id}>
              <td>{trainer.id}</td>
              <td>{trainer.name}</td>
              <td>{trainer.specialization}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeleteTrainer(trainer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerManagementPage;
