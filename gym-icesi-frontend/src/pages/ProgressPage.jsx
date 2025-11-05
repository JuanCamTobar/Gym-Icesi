import React, { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import customRoutineService from '../services/customRoutineService';
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
      const response = await customRoutineService.getCustomRoutines();
      setRoutines(response.data);
      if (response.data.length > 0) {
        setSelectedRoutine(response.data[0]._id);
      }
    } catch (err) {
      setError('No se pudieron obtener las rutinas.');
    }
  };

  const fetchProgress = async (routineId) => {
    try {
      const response = await progressService.getProgressByRoutine(routineId);
      setProgressData(response.data);
    } catch (err) {
      setError('No se pudieron obtener los datos de progreso.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Mi Progreso
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Selector de rutina */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una rutina:
          </label>
          <select
            value={selectedRoutine}
            onChange={(e) => setSelectedRoutine(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {routines.length > 0 ? (
              routines.map((routine) => (
                <option key={routine._id} value={routine._id}>
                  {routine.name}
                </option>
              ))
            ) : (
              <option>No hay rutinas disponibles</option>
            )}
          </select>
        </div>

        {/* Datos de progreso */}
        {progressData.length > 0 ? (
          <div className="grid gap-4">
            {progressData.map((progress) => (
              <div
                key={progress._id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(progress.date).toLocaleDateString()}
                </p>
                <div className="flex justify-between text-gray-800 font-medium">
                  <span>Repeticiones: <span className="text-indigo-600 font-semibold">{progress.reps}</span></span>
                  <span>Tiempo: <span className="text-indigo-600 font-semibold">{progress.time}</span></span>
                  <span>Esfuerzo: <span className="text-indigo-600 font-semibold">{progress.effort}</span></span>
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
    </div>
  );
};

export default ProgressPage;
