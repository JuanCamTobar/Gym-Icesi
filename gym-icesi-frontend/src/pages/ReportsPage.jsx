import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.user && user.user.role) {
      setLoading(true);
      fetchReports(user.user.role);
    } else if (!user) {
      setLoading(false);
      setError('No user logged in. Please log in to view reports.');
    }
  }, [user]);

  const fetchReports = async (role) => {
    try {
      let fetchedReports = {};
      if (role === 'ADMIN') {
        const [overviewRes, userActivityRes] = await Promise.all([
          reportService.getAdminOverviewReport(),
          reportService.getAdminUserActivityReport(),
        ]);
        fetchedReports = {
          adminOverview: overviewRes.data,
          adminUserActivity: userActivityRes.data,
        };
      } else if (role === 'EMPLOYEE' && user.user.employee_type==='Instructor') {
        const [studentOverviewRes, studentProgressRes] = await Promise.all([
          reportService.getTrainerStudentOverview(),
          reportService.getTrainerStudentProgress(),
        ]);
        fetchedReports = {
          trainerStudentOverview: studentOverviewRes.data,
          trainerStudentProgress: studentProgressRes.data,
        };
      } else if (role === 'STUDENT' || role === 'EMPLOYEE') {
        const [consistencyRes, totalRoutinesRes] = await Promise.all([
          reportService.getUserConsistencyReport(),
          reportService.getUserTotalRoutinesCompleted(),
        ]);
        fetchedReports = {
          userConsistency: consistencyRes.data,
          userTotalRoutines: totalRoutinesRes.data,
        };
      }
      setReports(fetchedReports);
    } catch (err) {
      setError(`Failed to fetch reports: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 text-center">Cargando reportes...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-red-700">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-8">Error al cargar reportes</h2>
        <p>{error}</p>
        <p>Por favor, asegúrese de que el backend esté corriendo y que tenga los permisos adecuados.</p>
      </div>
    );
  }

  if (!user || !user.user || !user.user.role) {
    return <div className="min-h-screen bg-gray-50 p-8 text-center text-red-500">Acceso denegado. Por favor, inicie sesión.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Reportes de Actividad
        </h2>

        {user.user.role === 'ADMIN' && (
          <>
            {/* Admin Overview Report */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Resumen General (Admin)</h3>
              {reports.adminOverview ? (
                <>
                  <p>Total de Usuarios: {reports.adminOverview.totalUsers}</p>
                  <p>Total de Entrenadores: {reports.adminOverview.totalTrainers}</p>
                  <p>Usuarios Activos (últimos 30 días): {reports.adminOverview.activeUsersCount}</p>
                </>
              ) : (
                <p className="text-gray-500">No hay datos de resumen general para mostrar.</p>
              )}
            </div>

            {/* Admin User Activity Report */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Actividad de Usuarios (Admin)</h3>
              {reports.adminUserActivity && reports.adminUserActivity.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {reports.adminUserActivity.map((activity, index) => (
                    <li key={activity.username} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{activity.username} ({activity.email})</p>
                        <p className="text-sm text-gray-500">Miembro desde: {new Date(activity.memberSince).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Última actividad: {activity.lastActivity ? new Date(activity.lastActivity).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {activity.totalRoutineLogs} Rutinas
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay datos de actividad de usuarios para mostrar.</p>
              )}
            </div>
          </>
        )}

        {user.user.role === 'EMPLOYEE' && user.user.employee_type==='Instructor' && (
          <>
            {/* Trainer Student Overview */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Resumen de Estudiantes Asignados (Entrenador)</h3>
              {reports.trainerStudentOverview && reports.trainerStudentOverview.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {reports.trainerStudentOverview.map((student, index) => (
                    <li key={student.username} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{student.username} ({student.email})</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {student.totalRoutineLogs} Rutinas Registradas
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay estudiantes asignados o datos de rutinas para mostrar.</p>
              )}
            </div>

            {/* Trainer Student Progress */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Progreso Promedio de Estudiantes (Entrenador)</h3>
              {reports.trainerStudentProgress && reports.trainerStudentProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={reports.trainerStudentProgress}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageCompletion" fill="#82ca9d" name="% Completado Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No hay datos de progreso de estudiantes para mostrar.</p>
              )}
            </div>
          </>
        )}

        {user.user.role === 'USER' || user.user.role === 'EMPLOYEE' &&(
          <>
            {/* User Consistency Report */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Consistencia de Entrenamiento (Usuario)</h3>
              {reports.userConsistency ? (
                <>
                  <p>Días totales entrenados: {reports.userConsistency.totalTrainingDays}</p>
                  <p>Días desde que se unió: {reports.userConsistency.daysSinceJoining}</p>
                  <p>Porcentaje de consistencia: {reports.userConsistency.consistencyPercentage?.toFixed(2)}%</p>
                </>
              ) : (
                <p className="text-gray-500">No hay datos de consistencia de entrenamiento para mostrar.</p>
              )}
            </div>

            {/* User Total Routines Completed */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Total de Rutinas Iniciadas (Usuario)</h3>
              {reports.userTotalRoutines ? (
                <p>Rutinas Iniciadas: {reports.userTotalRoutines.totalRoutinesCompleted}</p>
              ) : (
                <p className="text-gray-500">No hay datos de rutinas completadas para mostrar.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;