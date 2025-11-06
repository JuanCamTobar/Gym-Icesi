import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import customRoutineService from '../services/customRoutineService';
import progressService from '../services/progressService';

const StudentDetailsPage = () => {
  const { studentUsername } = useParams();
  const [studentRoutines, setStudentRoutines] = useState([]);
  const [selectedRoutineForProgress, setSelectedRoutineForProgress] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoutineDetailsModal, setShowRoutineDetailsModal] = useState(false);
  const [selectedRoutineDetails, setSelectedRoutineDetails] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch custom routines for the student
        const routinesResponse = await customRoutineService.getCustomRoutinesByStudent(studentUsername);
        setStudentRoutines(routinesResponse.data);
        if (routinesResponse.data.length > 0) {
          setSelectedRoutineForProgress(routinesResponse.data[0]._id);
        }
      } catch (err) {
        setError('Error al cargar las rutinas del estudiante.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [studentUsername]);

  useEffect(() => {
    if (selectedRoutineForProgress) {
      fetchProgressForRoutine(selectedRoutineForProgress);
    }
  }, [selectedRoutineForProgress]);

  const fetchProgressForRoutine = async (routineId) => {
    try {
      const response = await progressService.getProgressByRoutineAndStudent(routineId, studentUsername);
      setProgressData(response.data);
    } catch (err) {
      setError('Error al cargar el progreso de la rutina.');
      console.error(err);
    }
  };

  const handleShowRoutineDetails = (routine) => {
    setSelectedRoutineDetails(routine);
    setShowRoutineDetailsModal(true);
  };

  const handleCloseRoutineDetailsModal = () => {
    setSelectedRoutineDetails(null);
    setShowRoutineDetailsModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Cargando datos del estudiante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Detalles del Estudiante: {studentUsername}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Rutinas del Estudiante */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Rutinas Personalizadas</h3>
          {studentRoutines.length > 0 ? (
            <div className="grid gap-4">
              {studentRoutines.map((routine) => (
                <div
                  key={routine._id}
                  className="bg-gray-50 p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800">{routine.name}</span>
                  <button
                    onClick={() => handleShowRoutineDetails(routine)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                  >
                    Más detalles
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Este estudiante no tiene rutinas personalizadas.</p>
          )}
        </div>

        {/* Selector de Rutina para Progreso */}
        {studentRoutines.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
            <label htmlFor="progress-routine-select" className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una rutina para ver su progreso:
            </label>
            <select
              id="progress-routine-select"
              value={selectedRoutineForProgress}
              onChange={(e) => setSelectedRoutineForProgress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {studentRoutines.map((routine) => (
                <option key={routine._id} value={routine._id}>
                  {routine.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Historial de Progreso */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Historial de Progreso</h3>
          {progressData.length > 0 ? (
            <div className="grid gap-4">
              {progressData.map((progressEntry) => (
                <div
                  key={progressEntry._id}
                  className="bg-gray-50 p-5 rounded-2xl shadow-md border border-gray-200 transition"
                >
                  <p className="text-sm text-gray-500 mb-2">
                    Fecha: {new Date(progressEntry.date).toLocaleDateString()}
                  </p>
                  <h4 className="font-semibold text-gray-800 mb-3">Rutina: {studentRoutines.find(r => r._id === progressEntry.routine_id)?.name}</h4>
                  <div className="space-y-3">
                    {progressEntry.exercises_progress.map((exProgress, exIndex) => (
                      <div key={exIndex} className="border-l-4 border-indigo-400 pl-3">
                        <p className="font-medium text-gray-700">Ejercicio: {exProgress.exercise_id.name}</p>
                        <p className="text-sm text-gray-600">Estado: {exProgress.completion_status === 'completed_totally' ? 'Completado Totalmente' : exProgress.completion_status === 'different_completion' ? 'Completación Diferente' : 'No Completado'}</p>
                        {exProgress.sets && <p className="text-sm text-gray-600">Series: {exProgress.sets}</p>}
                        {exProgress.reps && <p className="text-sm text-gray-600">Repeticiones: {exProgress.reps}</p>}
                        {exProgress.weight && <p className="text-sm text-gray-600">Peso: {exProgress.weight} kg</p>}
                        {exProgress.duration && <p className="text-sm text-gray-600">Duración: {exProgress.duration} min</p>}
                        {exProgress.notes && <p className="text-sm text-gray-600">Notas: {exProgress.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No hay datos de progreso disponibles para esta rutina.
            </p>
          )}
        </div>

        {/* Routine Details Modal (similar to RoutinesPage) */}
        {showRoutineDetailsModal && selectedRoutineDetails && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-8 relative animate-fadeIn">
              <button
                onClick={handleCloseRoutineDetailsModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition text-2xl"
                aria-label="Cerrar"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-indigo-700 mb-2 text-center break-words">
                Detalles de la Rutina
              </h3>
              <p className="text-center text-gray-600 font-medium mb-6 break-words">
                {selectedRoutineDetails.name}
              </p>
              <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-6">
                {selectedRoutineDetails.exercises.length > 0 ? (
                  selectedRoutineDetails.exercises.map((ex, index) => (
                    <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition space-y-1">
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
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handleCloseRoutineDetailsModal}
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

export default StudentDetailsPage;
