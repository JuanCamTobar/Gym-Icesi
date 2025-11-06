import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import exerciseService from '../services/exerciseService';
import customRoutineService from '../services/customRoutineService';

const EditRoutinePage = () => {
  const { id } = useParams(); // Get routine ID from URL
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState([]); // All available exercises
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editedExerciseDetails, setEditedExerciseDetails] = useState({
    sets: '',
    reps: '',
    duration: '',
    weight: '',
  });
  const [showEditSelectedModal, setShowEditSelectedModal] = useState(false);
  const [editingSelectedExerciseIndex, setEditingSelectedExerciseIndex] = useState(null);
  const [editedSelectedExerciseDetails, setEditedSelectedExerciseDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all available exercises
        const exercisesResponse = await exerciseService.getExercises();
        setExercises(exercisesResponse.data);

        // Fetch the specific routine to edit
        const routineResponse = await customRoutineService.getCustomRoutineById(id);
        const routineData = routineResponse.data;
        setRoutineName(routineData.name);
        // Map existing exercises in the routine to the selectedExercises format
        setSelectedExercises(routineData.exercises.map(ex => ({
          exercise_id: ex.exercise_id._id,
          name: ex.exercise_id.name,
          type: ex.exercise_id.type,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          weight: ex.weight,
        })));

      } catch (err) {
        setError('Error al cargar los datos de la rutina o los ejercicios.');
        console.error(err);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleAddSelectedExercise = (exercise) => {
    if (!selectedExercises.some(ex => ex.exercise_id === exercise._id)) {
      setSelectedExercises([...selectedExercises, { exercise_id: exercise._id, name: exercise.name }]);
    }
  };

  const handleRemoveSelectedExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.exercise_id !== exerciseId));
  };

  const handleEditAndAddClick = (exercise) => {
    setEditingExercise(exercise);
    setEditedExerciseDetails({
      sets: '',
      reps: '',
      duration: '',
      weight: '',
    });
    setShowEditModal(true);
  };

  const handleEditModalChange = (e) => {
    const { name, value } = e.target;
    setEditedExerciseDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEditedExercise = () => {
    if (editingExercise) {
      const newSelectedExercise = {
        exercise_id: editingExercise._id,
        name: editingExercise.name,
        ...editedExerciseDetails,
      };
      setSelectedExercises([...selectedExercises, newSelectedExercise]);
      handleCloseEditModal();
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingExercise(null);
    setEditedExerciseDetails({
      sets: '',
      reps: '',
      duration: '',
      weight: '',
    });
  };

  const handleEditSelectedExerciseClick = (exercise, index) => {
    setEditingSelectedExerciseIndex(index);
    setEditedSelectedExerciseDetails({
      exercise_id: exercise.exercise_id,
      name: exercise.name,
      type: exercise.type, // Assuming type is available in selected exercise
      sets: exercise.sets || '',
      reps: exercise.reps || '',
      duration: exercise.duration || '',
      weight: exercise.weight || '',
    });
    setShowEditSelectedModal(true);
  };

  const handleEditSelectedModalChange = (e) => {
    const { name, value } = e.target;
    setEditedSelectedExerciseDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEditedSelectedExercise = () => {
    if (editingSelectedExerciseIndex !== null && editedSelectedExerciseDetails) {
      const updatedSelectedExercises = [...selectedExercises];
      updatedSelectedExercises[editingSelectedExerciseIndex] = editedSelectedExerciseDetails;
      setSelectedExercises(updatedSelectedExercises);
      handleCloseEditSelectedModal();
    }
  };

  const handleCloseEditSelectedModal = () => {
    setShowEditSelectedModal(false);
    setEditingSelectedExerciseIndex(null);
    setEditedSelectedExerciseDetails(null);
  };

  const handleSubmitRoutine = async (e) => {
    e.preventDefault();
    if (!routineName) {
      setError('El nombre de la rutina no puede estar vacío.');
      return;
    }
    if (selectedExercises.length === 0) {
      setError('Debe seleccionar al menos un ejercicio para la rutina.');
      return;
    }

    try {
      await customRoutineService.updateCustomRoutine(id, routineName, selectedExercises);
      setSuccess('Rutina actualizada exitosamente!');
      setError('');
      navigate('/routines'); // Navigate back to routines page
    } catch (err) {
      setError('Error al actualizar la rutina.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Editar Rutina
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 border border-green-300 text-center py-2 mb-4 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmitRoutine} className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="routineName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre de la Rutina:
            </label>
            <input
              type="text"
              id="routineName"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Ejercicios Seleccionados</h3>
          {selectedExercises.length > 0 ? (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedExercises.map((ex, index) => (
                <div key={ex.exercise_id + '-' + index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                  <span>{ex.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditSelectedExerciseClick(ex, index)}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedExercise(ex.exercise_id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No hay ejercicios seleccionados.</p>
          )}

          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Ejercicios Existentes</h3>
          {exercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {exercises.map(ex => (
                <div key={ex._id} className="flex flex-col bg-gray-100 p-3 rounded-lg">
                  <span className="font-semibold text-gray-800">{ex.name}</span>
                  {ex.description && <p className="text-sm text-gray-600">{ex.description}</p>}
                  {ex.type && <p className="text-xs text-gray-500">Tipo: {ex.type}</p>}
                  {ex.duration && <p className="text-xs text-gray-500">Duración: {ex.duration}</p>}
                  {ex.difficulty && <p className="text-xs text-gray-500">Dificultad: {ex.difficulty}</p>}
                  {ex.video_url && (
                    <a
                      href={ex.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-500 hover:underline mt-1"
                    >
                      Ver Video
                    </a>
                  )}
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleAddSelectedExercise(ex)}
                      disabled={selectedExercises.some(selEx => selEx.exercise_id === ex._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Añadir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditAndAddClick(ex)}
                      disabled={selectedExercises.some(selEx => selEx.exercise_id === ex._id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Editar y Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No hay ejercicios disponibles.</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Guardar Cambios
          </button>
        </form>

        {/* Edit Exercise Modal (for adding new exercises with custom details) */}
        {showEditModal && editingExercise && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-2xl font-bold text-center text-indigo-600 mb-6 text-center">
                Editar Ejercicio: {editingExercise.name}
              </h3>
              <div className="space-y-4">
                {editingExercise.type !== 'Cardio' && (
                  <>
                    <div>
                      <label htmlFor="sets" className="block text-gray-700 text-sm font-bold mb-2">Series:</label>
                      <input
                        type="number"
                        id="sets"
                        name="sets"
                        value={editedExerciseDetails.sets}
                        onChange={handleEditModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="reps" className="block text-gray-700 text-sm font-bold mb-2">Repeticiones:</label>
                      <input
                        type="number"
                        id="reps"
                        name="reps"
                        value={editedExerciseDetails.reps}
                        onChange={handleEditModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="weight" className="block text-gray-700 text-sm font-bold mb-2">Peso (kg):</label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={editedExerciseDetails.weight}
                        onChange={handleEditModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">Duración (minutos):</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={editedExerciseDetails.duration}
                    onChange={handleEditModalChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedExercise}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Guardar y Añadir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Selected Exercise Modal */}
        {showEditSelectedModal && editedSelectedExerciseDetails && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-2xl font-bold text-center text-indigo-600 mb-6 text-center">
                Editar Ejercicio: {editedSelectedExerciseDetails.name}
              </h3>
              <div className="space-y-4">
                {editedSelectedExerciseDetails.type !== 'Cardio' && (
                  <>
                    <div>
                      <label htmlFor="selectedSets" className="block text-gray-700 text-sm font-bold mb-2">Series:</label>
                      <input
                        type="number"
                        id="selectedSets"
                        name="sets"
                        value={editedSelectedExerciseDetails.sets}
                        onChange={handleEditSelectedModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="selectedReps" className="block text-gray-700 text-sm font-bold mb-2">Repeticiones:</label>
                      <input
                        type="number"
                        id="selectedReps"
                        name="reps"
                        value={editedSelectedExerciseDetails.reps}
                        onChange={handleEditSelectedModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="selectedWeight" className="block text-gray-700 text-sm font-bold mb-2">Peso (kg):</label>
                      <input
                        type="number"
                        id="selectedWeight"
                        name="weight"
                        value={editedSelectedExerciseDetails.weight}
                        onChange={handleEditSelectedModalChange}
                        className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor="selectedDuration" className="block text-gray-700 text-sm font-bold mb-2">Duración (minutos):</label>
                  <input
                    type="number"
                    id="selectedDuration"
                    name="duration"
                    value={editedSelectedExerciseDetails.duration}
                    onChange={handleEditSelectedModalChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseEditSelectedModal}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedSelectedExercise}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRoutinePage;
