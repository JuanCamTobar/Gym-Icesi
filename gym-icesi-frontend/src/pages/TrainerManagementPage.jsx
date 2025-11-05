import React, { useState, useEffect } from 'react';
import trainerService from '../services/trainerService';

const TrainerManagementPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getTrainers();
      setTrainers(response.data);
    } catch (err) {
      setError('No se pudieron obtener los entrenadores.');
    }
  };

  const handleViewUsers = async (trainer) => {
    setSelectedTrainer(trainer);
    try {
      const response = await trainerService.getTrainerUsers(trainer.trainer_uuid);
      console.log('Assigned users:', response.data);
      setAssignedUsers(response.data);
      setIsModalOpen(true);
    } catch (err) {
      setError('No se pudieron obtener los usuarios asignados.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
    setAssignedUsers([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gestión de Entrenadores
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Tipo de Contrato
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Facultad
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {trainers.length > 0 ? (
                trainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{trainer.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {`${trainer.first_name} ${trainer.last_name}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{trainer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{trainer.contract_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trainer['Faculty.name'] ? trainer['Faculty.name'] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {trainer['Campus.name'] ? trainer['Campus.name'] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleViewUsers(trainer)}
                      >
                        Ver Usuarios
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No se encontraron entrenadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedTrainer && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
              <h3 className="text-2xl font-bold mb-4">Usuarios de {selectedTrainer.first_name} {selectedTrainer.last_name}</h3>
              {assignedUsers.length > 0 ? (
                <ul>
                  {assignedUsers.map(user => (
                    <li key={user.username} className="border-b py-2">
                      {user.Student ? `${user.Student.first_name} ${user.Student.last_name}` : user.Employee ? `${user.Employee.first_name} ${user.Employee.last_name}` : user.username}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay usuarios asignados a este entrenador.</p>
              )}
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerManagementPage;
