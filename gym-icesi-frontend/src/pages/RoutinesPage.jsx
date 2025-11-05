import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customRoutineService from '../services/customRoutineService';
import predefinedRoutineService from '../services/predefinedRoutineService';

const RoutinesPage = () => {
  const [routines, setRoutines] = useState([]);
  const [predefinedRoutines, setPredefinedRoutines] = useState([]);
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [editingRoutineName, setEditingRoutineName] = useState('');
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoutineDetails, setSelectedRoutineDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutines();
    fetchPredefinedRoutines();
  }, []);

  const handleNavigateToAddRoutine = () => {
    navigate('/add-routine');
  };

  const fetchRoutines = async () => {
    try {
      const response = await customRoutineService.getCustomRoutines();
      setRoutines(response.data);
    } catch (err) {
      setError('No se pudieron obtener las rutinas personalizadas.');
    }
  };

  const fetchPredefinedRoutines = async () => {
    try {
      const response = await predefinedRoutineService.getPredefinedRoutines();
      setPredefinedRoutines(response.data);
    } catch (err) {
      setError('No se pudieron obtener las rutinas predefinidas.');
    }
  };

  const handleUpdateRoutine = async (id) => {
    try {
      await customRoutineService.updateCustomRoutine(id, editingRoutineName);
      setEditingRoutineId(null);
      setEditingRoutineName('');
      fetchRoutines();
    } catch (err) {
      setError('No se pudo actualizar la rutina.');
    }
  };

  const handleDeleteRoutine = async (id) => {
    try {
      await customRoutineService.deleteCustomRoutine(id);
      fetchRoutines();
    } catch (err) {
      setError('No se pudo eliminar la rutina.');
    }
  };

  const handleAdoptRoutine = async (routine) => {
    try {
      await customRoutineService.adoptPredefinedRoutine(routine._id);
      fetchRoutines();
    } catch (err) {
      setError('No se pudo adoptar la rutina.');
    }
  };

  const handleShowDetails = (routine) => {
    setSelectedRoutineDetails(routine);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedRoutineDetails(null);
    setShowDetailsModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Mis Rutinas
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Botón para añadir nueva rutina */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNavigateToAddRoutine}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Añadir nueva rutina
          </button>
        </div>

        {/* Lista de rutinas personalizadas */}
        <div className="grid gap-4 mb-12">
          {routines.length > 0 ? (
            routines.map((routine) => (
              <div
                key={routine._id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row justify-between items-center"
              >
                {editingRoutineId === routine._id ? (
                  <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                    <input
                      type="text"
                      value={editingRoutineName}
                      onChange={(e) => setEditingRoutineName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRoutine(routine._id)}
                        className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingRoutineId(null)}
                        className="bg-gray-200 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-gray-800">{routine.name}</span>
                    <div className="flex gap-3 mt-3 md:mt-0">
                      <button
                        onClick={() => handleShowDetails(routine)}
                        className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg hover:bg-blue-200 transition"
                      >
                        Más detalles
                      </button>
                      <button
                        onClick={() => {
                          setEditingRoutineId(routine._id);
                          setEditingRoutineName(routine.name);
                        }}
                        className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-lg hover:bg-indigo-200 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteRoutine(routine._id)}
                        className="bg-red-100 text-red-700 px-4 py-1 rounded-lg hover:bg-red-200 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No tienes rutinas personalizadas aún.
            </p>
          )}
        </div>

        {/* Rutinas predefinidas */}
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Rutinas Predefinidas
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {predefinedRoutines.length > 0 ? (
            predefinedRoutines.map((routine) => (
              <div
                key={routine._id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {routine.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {routine.description || 'Sin descripción'}
                </p>
                <p className="text-sm text-indigo-600 font-medium mb-2">
                  Dificultad: {routine.difficulty}
                </p>
                <ul className="text-sm text-gray-700 mb-3 list-disc list-inside">
                  {routine.exercises.map((exercise) => (
                    <li key={exercise._id}>{exercise.name}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAdoptRoutine(routine)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Adoptar
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No hay rutinas predefinidas disponibles.
            </p>
          )}
        </div>

        {/* Routine Details Modal */}
        {showDetailsModal && selectedRoutineDetails && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
              <h3 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                Detalles de la Rutina: {selectedRoutineDetails.name}
              </h3>

              <div className="space-y-6">
                {selectedRoutineDetails.exercises.length > 0 ? (
                  selectedRoutineDetails.exercises.map((ex, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">{ex.exercise_id.name}</h4>
                      {ex.exercise_id.description && <p className="text-sm text-gray-700">Descripción: {ex.exercise_id.description}</p>}
                      {ex.exercise_id.type && <p className="text-sm text-gray-700">Tipo: {ex.exercise_id.type}</p>}
                      {ex.exercise_id.duration && <p className="text-sm text-gray-700">Duración: {ex.exercise_id.duration}</p>}
                      {ex.exercise_id.difficulty && <p className="text-sm text-gray-700">Dificultad: {ex.exercise_id.difficulty}</p>}
                      {ex.sets && <p className="text-sm text-gray-700">Series: {ex.sets}</p>}
                      {ex.reps && <p className="text-sm text-gray-700">Repeticiones: {ex.reps}</p>}
                      {ex.weight && <p className="text-sm text-gray-700">Peso: {ex.weight} kg</p>}
                      {ex.exercise_id.video_url && (
                        <a
                          href={ex.exercise_id.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-500 hover:underline mt-2 block"
                        >
                          Ver Video
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Esta rutina no tiene ejercicios.</p>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={handleCloseDetailsModal}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinesPage;
