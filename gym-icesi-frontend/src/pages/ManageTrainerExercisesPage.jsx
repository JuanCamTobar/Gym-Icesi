import React, { useState, useEffect } from 'react';
import exerciseService from '../services/exerciseService';
import predefinedRoutineService from '../services/predefinedRoutineService';

const ManageTrainerExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [predefinedRoutines, setPredefinedRoutines] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    type: 'Fuerza', // Default type
    duration: '',
    difficulty: 'Principiante', // Default difficulty
    video_url: '',
  });
  const [newPredefinedRoutine, setNewPredefinedRoutine] = useState({
    name: '',
    description: '',
    difficulty: 'Principiante', // Default difficulty
  });
  const [selectedExercisesForRoutine, setSelectedExercisesForRoutine] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [exercisesRes, routinesRes] = await Promise.all([
        exerciseService.getExercises(),
        predefinedRoutineService.getPredefinedRoutines(),
      ]);
      setExercises(exercisesRes.data);
      setPredefinedRoutines(routinesRes.data);
    } catch (err) {
      setError('Error al cargar los datos.');
      console.error(err);
    }
  };

  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewExercise = async (e) => {
    e.preventDefault();
    try {
      await exerciseService.createExercise(newExercise);
      setSuccessMessage('Ejercicio creado exitosamente!');
      setNewExercise({
        name: '',
        description: '',
        type: 'Fuerza',
        duration: '',
        difficulty: 'Principiante',
        video_url: '',
      });
      fetchData(); // Refresh data
    } catch (err) {
      setError('Error al crear el ejercicio.');
      console.error(err);
    }
  };

  const handleNewRoutineChange = (e) => {
    const { name, value } = e.target;
    setNewPredefinedRoutine(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExerciseToRoutine = (exercise) => {
    if (!selectedExercisesForRoutine.some(ex => ex._id === exercise._id)) {
      setSelectedExercisesForRoutine([...selectedExercisesForRoutine, exercise]);
    }
  };

  const handleRemoveExerciseFromRoutine = (exerciseId) => {
    setSelectedExercisesForRoutine(selectedExercisesForRoutine.filter(ex => ex._id !== exerciseId));
  };

  const handleSubmitNewPredefinedRoutine = async (e) => {
    e.preventDefault();
    try {
      const routineData = {
        ...newPredefinedRoutine,
        exercises: selectedExercisesForRoutine.map(ex => ex._id),
      };
      await predefinedRoutineService.createPredefinedRoutine(routineData);
      setSuccessMessage('Rutina prediseñada creada exitosamente!');
      setNewPredefinedRoutine({
        name: '',
        description: '',
        difficulty: 'Principiante',
      });
      setSelectedExercisesForRoutine([]);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Error al crear la rutina prediseñada.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gestionar Rutinas Prediseñadas y Ejercicios
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

        {/* Crear Nuevo Ejercicio */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Crear Nuevo Ejercicio</h3>
          <form onSubmit={handleSubmitNewExercise} className="space-y-4">
            <div>
              <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700">Nombre:</label>
              <input type="text" id="exerciseName" name="name" value={newExercise.name} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div>
              <label htmlFor="exerciseDescription" className="block text-sm font-medium text-gray-700">Descripción:</label>
              <textarea id="exerciseDescription" name="description" value={newExercise.description} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2" rows="3"></textarea>
            </div>
            <div>
              <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700">Tipo:</label>
              <select id="exerciseType" name="type" value={newExercise.type} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2">
                <option value="Fuerza">Fuerza</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibilidad">Flexibilidad</option>
                <option value="Equilibrio">Equilibrio</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="exerciseDuration" className="block text-sm font-medium text-gray-700">Duración (ej. 5-10 min):</label>
              <input type="text" id="exerciseDuration" name="duration" value={newExercise.duration} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label htmlFor="exerciseDifficulty" className="block text-sm font-medium text-gray-700">Dificultad:</label>
              <select id="exerciseDifficulty" name="difficulty" value={newExercise.difficulty} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2">
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label htmlFor="exerciseVideoUrl" className="block text-sm font-medium text-gray-700">URL del Video:</label>
              <input type="text" id="exerciseVideoUrl" name="video_url" value={newExercise.video_url} onChange={handleNewExerciseChange} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Crear Ejercicio</button>
          </form>
        </div>

        {/* Crear Nueva Rutina Prediseñada */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Crear Nueva Rutina Prediseñada</h3>
          <form onSubmit={handleSubmitNewPredefinedRoutine} className="space-y-4">
            <div>
              <label htmlFor="routineName" className="block text-sm font-medium text-gray-700">Nombre de la Rutina:</label>
              <input type="text" id="routineName" name="name" value={newPredefinedRoutine.name} onChange={handleNewRoutineChange} className="w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div>
              <label htmlFor="routineDescription" className="block text-sm font-medium text-gray-700">Descripción:</label>
              <textarea id="routineDescription" name="description" value={newPredefinedRoutine.description} onChange={handleNewRoutineChange} className="w-full border border-gray-300 rounded-md p-2" rows="3"></textarea>
            </div>
            <div>
              <label htmlFor="routineDifficulty" className="block text-sm font-medium text-gray-700">Dificultad:</label>
              <select id="routineDifficulty" name="difficulty" value={newPredefinedRoutine.difficulty} onChange={handleNewRoutineChange} className="w-full border border-gray-300 rounded-md p-2">
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Seleccionar Ejercicios para la Rutina:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exercises.length > 0 ? (
                exercises.map(ex => (
                  <div key={ex._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <span>{ex.name}</span>
                    <button
                      type="button"
                      onClick={() => handleAddExerciseToRoutine(ex)}
                      disabled={selectedExercisesForRoutine.some(selEx => selEx._id === ex._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Añadir
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay ejercicios disponibles para seleccionar.</p>
              )}
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Ejercicios Seleccionados:</h4>
            {selectedExercisesForRoutine.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedExercisesForRoutine.map(ex => (
                  <div key={ex._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <span>{ex.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseFromRoutine(ex._id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Ningún ejercicio seleccionado.</p>
            )}

            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition mt-4">Crear Rutina Prediseñada</button>
          </form>
        </div>

        {/* Listado de Ejercicios Existentes */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Ejercicios Existentes</h3>
          {exercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map(ex => (
                <div key={ex._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">{ex.name}</h4>
                  <p className="text-sm text-gray-600">Tipo: {ex.type}</p>
                  <p className="text-sm text-gray-600">Dificultad: {ex.difficulty}</p>
                  {ex.description && <p className="text-sm text-gray-700 mt-1">{ex.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay ejercicios registrados.</p>
          )}
        </div>

        {/* Listado de Rutinas Prediseñadas Existentes */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Rutinas Prediseñadas Existentes</h3>
          {predefinedRoutines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedRoutines.map(routine => (
                <div key={routine._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">{routine.name}</h4>
                  <p className="text-sm text-gray-600">Dificultad: {routine.difficulty}</p>
                  {routine.description && <p className="text-sm text-gray-700 mt-1">{routine.description}</p>}
                  <p className="text-sm text-gray-700 mt-2">Ejercicios:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {routine.exercises.map(ex => (
                      <li key={ex._id}>{ex.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay rutinas prediseñadas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTrainerExercisesPage;