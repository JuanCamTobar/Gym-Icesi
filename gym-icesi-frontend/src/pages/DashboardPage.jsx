import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import customRoutineService from '../services/customRoutineService';
import predefinedRoutineService from '../services/predefinedRoutineService';
import samanBackground from '../assets/saman.jpg';

const DashboardPage = () => {
  const { user } = useAuth();
  const [customRoutines, setCustomRoutines] = useState([]);
  const [predefinedRoutines, setPredefinedRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [customRes, predefinedRes] = await Promise.all([
          customRoutineService.getCustomRoutines(),
          predefinedRoutineService.getPredefinedRoutines(),
        ]);
        setCustomRoutines(customRes.data);
        setPredefinedRoutines(predefinedRes.data);
      } catch (err) {
        setError('Error al cargar las rutinas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, [user]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url(${samanBackground})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Bienvenido al Gimnasio Icesi
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {!user ? (
          <p className="text-lg text-gray-700">Por favor, inicia sesión para ver tu dashboard.</p>
        ) : loading ? (
          <p className="text-lg text-gray-700">Cargando tu dashboard...</p>
        ) : (
          <div className="space-y-8">
            {/* Admin Dashboard */}
            {user.user.role === 'ADMIN' && (
              <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-indigo-600 mb-4">Panel de Administrador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/admin/users" className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.165-1.294-.478-1.857m0 0a5.002 5.002 0 00-9.044 0M9 20H4v-2a3 3 0 015-2.236M9 20v-2a3 3 0 015-2.236M12 11a3 3 0 100-6 3 3 0 000 6zm-4.5 5a4.5 4.5 0 119 0H12a4.5 4.5 0 01-4.5 0z" />
                    </svg>
                    Gestión de Usuarios
                  </Link>
                  <Link to="/admin/trainers" className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-3a4 4 0 11-8 0 4 4 0 018 0zM12 15v2m-2 0H7M2 20h10v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2z" />
                    </svg>
                    Gestión de Entrenadores
                  </Link>
                  <Link to="/statistics" className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Estadísticas
                  </Link>
                  <Link to="/admin/reports" className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reportes
                  </Link>
                </div>
              </div>
            )}

            {/* Instructor Dashboard */}
            {user.user.role === 'EMPLOYEE' && user.user.employee_type === 'Instructor' && (
              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Panel de Instructor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/trainer/students-progress" className="flex flex-col items-center justify-center p-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a4 4 0 00-9.707-2.873M12 18v.001L12 18z" />
                    </svg>
                    Ver Progreso de Estudiantes
                  </Link>
                  <Link to="/trainer/manage-exercises" className="flex flex-col items-center justify-center p-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Gestionar Ejercicios y Rutinas
                  </Link>
                </div>
              </div>
            )}

            {/* General User Dashboard (Student/Other Employee) */}
            {(user.user.role === 'STUDENT' || (user.user.role === 'EMPLOYEE' && user.user.employee_type !== 'Instructor')) && (
              <div className="space-y-8">
                {/* Mis Rutinas */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">Mis Rutinas</h3>
                  {customRoutines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customRoutines.slice(0, 4).map(routine => (
                        <div key={routine._id} className="bg-white p-4 rounded-lg shadow-md border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                          <p className="font-semibold text-gray-800">{routine.name}</p>
                          <p className="text-sm text-gray-600">Ejercicios: {routine.exercises.length}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">Aún no tienes rutinas personalizadas. ¡Crea una!</p>
                  )}
                  <Link to="/routines" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Ver todas mis Rutinas</Link>
                </div>

                {/* Empieza Rutinas Nuevas */}
                <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">Empieza Rutinas Nuevas</h3>
                  {predefinedRoutines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {predefinedRoutines.slice(0, 4).map(routine => (
                        <div key={routine._id} className="bg-white p-4 rounded-lg shadow-md border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                          <p className="font-semibold text-gray-800">{routine.name}</p>
                          <p className="text-sm text-gray-600">Dificultad: {routine.difficulty}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">No hay rutinas prediseñadas disponibles.</p>
                  )}
                  <Link to="/routines" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">Explorar Rutinas Prediseñadas</Link>
                </div>

                {/* Mis Estadísticas */}
                <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-yellow-600 mb-4">Mis Estadísticas</h3>
                  <p className="text-gray-700 mb-4">Visualiza tu progreso y el resumen de tus actividades.</p>
                  <Link to="/statistics" className="mt-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
                    Ver Estadísticas
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;