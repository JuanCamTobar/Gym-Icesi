import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [trainerPerformance, setTrainerPerformance] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [topUsersRes, trainerPerfRes] = await Promise.all([
        reportService.getTopUsers(),
        reportService.getTrainerPerformance(),
      ]);
      setTopUsers(topUsersRes.data);
      setTrainerPerformance(trainerPerfRes.data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 text-center">Cargando reportes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Reportes de Actividad
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Top Users Report */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Top 5 Usuarios más Activos (por días de progreso)</h3>
          {topUsers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topUsers.map((user, index) => (
                <li key={user.username} className="py-3 flex items-center">
                  <span className="text-lg font-bold text-indigo-400 mr-4">{index + 1}</span>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {user.progress_days} días
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay datos de usuarios para mostrar.</p>
          )}
        </div>

        {/* Trainer Performance Report */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Rendimiento de Entrenadores (por comentarios realizados)</h3>
          {trainerPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={trainerPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trainer_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comment_count" fill="#8884d8" name="Comentarios Realizados" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No hay datos de rendimiento de entrenadores para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
