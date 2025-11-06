import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import trainerService from '../services/trainerService';

const StudentsProgressPage = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await trainerService.getAssignedStudents();
        setAssignedStudents(response.data);
      } catch (err) {
        setError('Error al cargar los estudiantes asignados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedStudents();
  }, []);

  const handleViewStudentDetails = (studentUsername) => {
    navigate(`/trainer/student-details/${studentUsername}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Progreso de Estudiantes Asignados
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando estudiantes...</p>
        ) : assignedStudents.length > 0 ? (
          <div className="grid gap-4">
            {assignedStudents.map((studentUser) => (
              <div
                key={studentUser.username}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">
                  {studentUser.Student ? `${studentUser.Student.first_name} ${studentUser.Student.last_name}` : studentUser.username}
                </span>
                <button
                  onClick={() => handleViewStudentDetails(studentUser.username)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No tienes estudiantes asignados.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentsProgressPage;
