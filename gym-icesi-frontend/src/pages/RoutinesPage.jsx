import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customRoutineService from '../services/customRoutineService';
import predefinedRoutineService from '../services/predefinedRoutineService';

const RoutinesPage = () => {
  const [routines, setRoutines] = useState([]);
  const [predefinedRoutines, setPredefinedRoutines] = useState([]);
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

  const handleNavigateToEditRoutine = (routineId) => {
    navigate(`/edit-routine/${routineId}`);
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
                <span className="font-semibold text-gray-800">{routine.name}</span>
                <div className="flex gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => handleShowDetails(routine)}
                    className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg hover:bg-blue-200 transition"
                  >
                    Más detalles
                  </button>
                  <button
                    onClick={() => handleNavigateToEditRoutine(routine._id)}
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

        {showDetailsModal && selectedRoutineDetails && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-8 relative animate-fadeIn">
              
              {/* Botón cerrar */}
              <button
                onClick={handleCloseDetailsModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition text-2xl"
                aria-label="Cerrar"
              >
                &times;
              </button>

              {/* Título */}
              <h3 className="text-2xl font-bold text-indigo-700 mb-2 text-center break-words">
                Detalles de la Rutina
              </h3>
              <p className="text-center text-gray-600 font-medium mb-6 break-words">
                {selectedRoutineDetails.name}
              </p>

              {/* Contenido con scroll si es largo */}
              <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-6">
                {selectedRoutineDetails.exercises.length > 0 ? (
                  selectedRoutineDetails.exercises.map((ex, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition space-y-1"
                    >
                      <h4 className="font-semibold text-lg text-gray-800">{ex.exercise_id.name}</h4>
                      {ex.exercise_id.description && <p className="text-sm text-gray-700 break-words"><span className="font-medium text-gray-800">Descripción:</span> {ex.exercise_id.description}</p>}
                      {ex.exercise_id.type && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Tipo:</span> {ex.exercise_id.type}</p>}
                      {ex.exercise_id.duration && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Duración:</span> {ex.exercise_id.duration}</p>}
                      {ex.exercise_id.difficulty && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Dificultad:</span> {ex.exercise_id.difficulty}</p>}
                      {ex.sets && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Series:</span> {ex.sets}</p>}
                      {ex.reps && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Repeticiones:</span> {ex.reps}</p>}
                      {ex.weight && <p className="text-sm text-gray-700"><span className="font-medium text-gray-800">Peso:</span> {ex.weight} kg</p>}
                      {ex.exercise_id.video_url && (
                        <a
                          href={ex.exercise_id.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-indigo-600 hover:text-indigo-800 hover:underline mt-2"
                        >
                          🎥 Ver Video
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Esta rutina no tiene ejercicios.</p>
                )}
              </div>

              {/* Botón cerrar inferior */}
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handleCloseDetailsModal}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
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
