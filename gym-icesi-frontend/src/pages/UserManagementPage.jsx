import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import trainerService from '../services/trainerService';
import Alert from '../components/Alert';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchTrainers()]);
      } catch (err) {
        setError('No se pudieron obtener los datos.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      const filteredUsers = response.data.filter(user => user.role !== 'ADMIN');
      setUsers(filteredUsers);
    } catch (err) {
      setError('No se pudieron obtener los usuarios.');
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getTrainers();
      const trainersWithUuid = response.data.map(trainer => ({
        ...trainer,
        uuid: trainer.trainer_uuid,
      }));
      setTrainers(trainersWithUuid);
    } catch (err) {
      setError('No se pudieron obtener los entrenadores.');
    }
  };

  const handleTrainerChange = (username, trainerId) => {
    setSelectedTrainers(prev => ({ ...prev, [username]: trainerId }));
  };

  const handleAssignTrainer = async (username) => {
    const trainerId = selectedTrainers[username];
    console.log('Assigning trainerId', trainerId, 'to user', username);
    if (!trainerId) {
      setError('Por favor, selecciona un entrenador.');
      return;
    }

    try {
      await userService.assignTrainer(username, trainerId);
      setAlert({ message: 'Entrenador asignado correctamente.', type: 'success' });
      fetchUsers();
    } catch (err) {
      setAlert({ message: 'Error al asignar entrenador.', type: 'error' });
      setError('No se pudo asignar el entrenador.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gestión de Usuarios
        </h2>

        <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />

        {error && (
                  <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
                    {error}
                  </div>
                )}
        
                {loading ? (
                  <div className="text-center">
                    <p>Cargando...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                            Correo
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                            Asignar Entrenador
                          </th>
                        </tr>
                      </thead>
        
                      <tbody className="divide-y divide-gray-100">
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr
                              key={user.username}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                {user.Student ? `${user.Student.first_name} ${user.Student.last_name}` : user.Employee ? `${user.Employee.first_name} ${user.Employee.last_name}` : user.username}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.role === 'ADMIN'
                                      ? 'bg-indigo-100 text-indigo-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {user.student_id || user.employee_id || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <select
                                  className="border border-gray-300 rounded-md px-2 py-1"
                                  defaultValue={user.trainerId || ''}
                                  onChange={(e) => handleTrainerChange(user.username, e.target.value)}
                                >
                                  <option value="">Seleccionar Entrenador</option>
                                  {trainers.map((trainer) => (
                                    <option key={trainer.id} value={trainer.uuid}>
                                      {trainer.first_name} {trainer.last_name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="ml-2 bg-indigo-500 text-white px-3 py-1 rounded-md"
                                  onClick={() => handleAssignTrainer(user.username)}
                                >
                                  Asignar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-8 text-center text-gray-500 text-sm"
                            >
                              No se encontraron usuarios registrados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>    </div>
  );
};

export default UserManagementPage;