import React, { useState, useEffect } from 'react';
import progressService from '../services/progressService';
import customRoutineService from '../services/customRoutineService';
import { useAuth } from '../context/AuthContext';

const ProgressPage = () => {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [selectedRoutineDetails, setSelectedRoutineDetails] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [dailyProgressEntries, setDailyProgressEntries] = useState([]);
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRoutines();
  }, []);

  useEffect(() => {
    if (selectedRoutineId) {
      fetchRoutineDetails(selectedRoutineId);
      fetchProgress(selectedRoutineId);
    }
  }, [selectedRoutineId]);

  const fetchRoutines = async () => {
    try {
      const response = await customRoutineService.getCustomRoutines();
      setRoutines(response.data);
      if (response.data.length > 0) {
        setSelectedRoutineId(response.data[0]._id);
      }
    } catch (err) {
      setError('No se pudieron obtener las rutinas.');
    }
  };

  const fetchRoutineDetails = async (routineId) => {
    try {
      const response = await customRoutineService.getCustomRoutineById(routineId);
      setSelectedRoutineDetails(response.data);
      // Initialize daily progress entries for each exercise in the routine
      setDailyProgressEntries(response.data.exercises.map(ex => ({
        exercise_id: ex.exercise_id._id,
        name: ex.exercise_id.name,
        type: ex.exercise_id.type,
        completion_status: 'not_completed',
        sets: ex.sets || '',
        reps: ex.reps || '',
        weight: ex.weight || '',
        duration: ex.duration || '',
        notes: '',
      })));
    } catch (err) {
      setError('No se pudieron obtener los detalles de la rutina.');
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

  const handleProgressChange = (index, field, value) => {
    const updatedEntries = [...dailyProgressEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setDailyProgressEntries(updatedEntries);
  };

  const handleSubmitDailyProgress = async (e) => {
    e.preventDefault();
    if (!selectedRoutineId) {
      setError('Por favor, selecciona una rutina.');
      return;
    }

    try {
      const progressToSubmit = dailyProgressEntries.map(entry => {
        const newEntry = { ...entry };
        // Clean up fields based on completion status and exercise type
        if (newEntry.completion_status === 'completed_totally') {
          newEntry.sets = '';
          newEntry.reps = '';
          newEntry.weight = '';
          newEntry.duration = '';
          newEntry.notes = 'Completado totalmente';
        } else if (newEntry.completion_status === 'not_completed') {
          newEntry.sets = '';
          newEntry.reps = '';
          newEntry.weight = '';
          newEntry.duration = '';
          newEntry.notes = 'No completado';
        } else if (newEntry.completion_status === 'different_completion') {
          if (newEntry.type === 'Cardio') {
            newEntry.sets = '';
            newEntry.reps = '';
            newEntry.weight = '';
          } else {
            newEntry.duration = '';
          }
        }
        return newEntry;
      });

      await progressService.recordDailyProgress({
        routine_id: selectedRoutineId,
        date: recordDate,
        exercises_progress: progressToSubmit,
      });
      setSuccessMessage('Progreso registrado exitosamente!');
      setError('');
      // Re-fetch progress data to update the historical view
      fetchProgress(selectedRoutineId);
    } catch (err) {
      setError('Error al registrar el progreso.');
      setSuccessMessage('');
      console.error(err);
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
        {successMessage && (
          <div className="bg-green-100 text-green-700 border border-green-300 text-center py-2 mb-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Selector de rutina */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <label htmlFor="routine-select" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una rutina:
          </label>
          <select
            id="routine-select"
            value={selectedRoutineId}
            onChange={(e) => setSelectedRoutineId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {routines.length > 0 ? (
              routines.map((routine) => (
                <option key={routine._id} value={routine._id}>
                  {routine.name}
                </option>
              ))
            ) : (
              <option value="">No hay rutinas disponibles</option>
            )}
          </select>
        </div>

        {selectedRoutineDetails && (
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-indigo-600 mb-4">Registrar Progreso Diario</h3>
            <form onSubmit={handleSubmitDailyProgress}>
              <div className="mb-4">
                <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha:</label>
                <input
                  type="date"
                  id="recordDate"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              {dailyProgressEntries.map((entry, index) => (
                <div key={entry.exercise_id} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">{entry.name} ({entry.type})</h4>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Completación:</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          name={`completion-${index}`}
                          value="completed_totally"
                          checked={entry.completion_status === 'completed_totally'}
                          onChange={() => handleProgressChange(index, 'completion_status', 'completed_totally')}
                        />
                        <span className="ml-2 text-gray-700">Completado Totalmente</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          name={`completion-${index}`}
                          value="different_completion"
                          checked={entry.completion_status === 'different_completion'}
                          onChange={() => handleProgressChange(index, 'completion_status', 'different_completion')}
                        />
                        <span className="ml-2 text-gray-700">Completación Diferente</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          name={`completion-${index}`}
                          value="not_completed"
                          checked={entry.completion_status === 'not_completed'}
                          onChange={() => handleProgressChange(index, 'completion_status', 'not_completed')}
                        />
                        <span className="ml-2 text-gray-700">No Completado</span>
                      </label>
                    </div>
                  </div>

                  {entry.completion_status === 'different_completion' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {entry.type !== 'Cardio' && (
                        <>
                          <div>
                            <label htmlFor={`sets-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Series:</label>
                            <input
                              type="number"
                              id={`sets-${index}`}
                              value={entry.sets}
                              onChange={(e) => handleProgressChange(index, 'sets', e.target.value)}
                              className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
                            />
                          </div>
                          <div>
                            <label htmlFor={`reps-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Repeticiones:</label>
                            <input
                              type="number"
                              id={`reps-${index}`}
                              value={entry.reps}
                              onChange={(e) => handleProgressChange(index, 'reps', e.target.value)}
                              className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
                            />
                          </div>
                          <div>
                            <label htmlFor={`weight-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Peso (kg):</label>
                            <input
                              type="number"
                              id={`weight-${index}`}
                              value={entry.weight}
                              onChange={(e) => handleProgressChange(index, 'weight', e.target.value)}
                              className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
                            />
                          </div>
                        </>
                      )}
                      {entry.type === 'Cardio' && (
                        <div>
                          <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos):</label>
                          <input
                            type="number"
                            id={`duration-${index}`}
                            value={entry.duration}
                            onChange={(e) => handleProgressChange(index, 'duration', e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
                          />
                        </div>
                      )}
                      <div>
                        <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Notas:</label>
                        <textarea
                          id={`notes-${index}`}
                          value={entry.notes}
                          onChange={(e) => handleProgressChange(index, 'notes', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
                          rows="2"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition mt-6"
              >
                Guardar Progreso
              </button>
            </form>
          </div>
        )}

        {/* Datos de progreso */}
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
                  <h4 className="font-semibold text-gray-800 mb-3">Rutina: {selectedRoutineDetails?.name}</h4>
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
      </div>
    </div>
  );
};

export default ProgressPage;
