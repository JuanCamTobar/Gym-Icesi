import React, { useState, useEffect, useContext } from 'react';
import statisticsService from '../services/statisticsService';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPage = () => {
  const { user } = useAuth();
  const [userStartedRoutines, setUserStartedRoutines] = useState({});
  const [userProgressCalendar, setUserProgressCalendar] = useState(null);
  const [trainerStats, setTrainerStats] = useState([]);
  const [adminOverview, setAdminOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        if (user) {
          // Fetch user-specific stats (for STUDENT, EMPLOYEE, ADMIN)
          const routinesRes = await statisticsService.getUserStartedRoutines();
          setUserStartedRoutines(routinesRes.data);

          const progressRes = await statisticsService.getUserProgressCalendar(selectedMonth);
          setUserProgressCalendar(progressRes.data);

          if (user.role === 'EMPLOYEE') {
            const trainerRes = await statisticsService.getTrainerStats();
            setTrainerStats(trainerRes.data);
          }

          if (user.role === 'ADMIN') {
            const adminRes = await statisticsService.getAdminOverview();
            setAdminOverview(adminRes.data);
          }
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to fetch statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, selectedMonth]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading statistics...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-4">Please log in to view statistics.</div>;
  }

  const renderUserStats = () => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Tus Estadísticas Mensuales</h3>

      {/* Selector de Mes */}
      <div className="mb-4">
        <label htmlFor="month-select" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Mes:</label>
        <input
          type="month"
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Rutinas Iniciadas */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-xl font-semibold mb-2">Rutinas Iniciadas</h4>
        {Object.keys(userStartedRoutines).length > 0 ? (
          Object.entries(userStartedRoutines).map(([month, routines]) => (
            <div key={month} className="mb-4">
              <h5 className="text-lg font-medium">{month}</h5>
              <ul>
                {routines.map((routine) => (
                  <li key={routine.id} className="ml-4 list-disc">
                    {routine.routine_name} ({routine.routine_type}) - {new Date(routine.started_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No has iniciado ninguna rutina aún.</p>
        )}
      </div>

      {/* Gráfico de Pastel de Progreso */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-xl font-semibold mb-2">Días de Progreso en {selectedMonth}</h4>
        {userProgressCalendar ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Días con Progreso', value: userProgressCalendar.daysWithProgress },
                  { name: 'Días sin Progreso', value: userProgressCalendar.daysWithoutProgress },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell key="cell-0" fill="#82ca9d" /> {/* Green for progress */}
                <Cell key="cell-1" fill="#ffc658" /> {/* Yellow for no progress */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay datos de progreso para el mes seleccionado.</p>
        )}
      </div>
    </div>
  );

  const renderTrainerStats = () => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Estadísticas como Instructor</h3>
      {trainerStats.length > 0 ? (
        trainerStats.map((stats) => (
          <div key={stats.month} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h4 className="text-xl font-semibold mb-2">Mes: {stats.month}</h4>
            <p>Nuevas Asignaciones: {stats.new_assignments}</p>
            <p>Seguimientos Realizados (Comentarios): {stats.followups}</p>
          </div>
        ))
      ) : (
        <p>No hay estadísticas disponibles como instructor.</p>
      )}
    </div>
  );

  const renderAdminStats = () => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Panel de Administración (Estadísticas Globales)</h3>

      {/* Rutinas Iniciadas Globales */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-xl font-semibold mb-2">Rutinas Iniciadas (Global)</h4>
        {adminOverview.routines && adminOverview.routines.length > 0 ? (
          adminOverview.routines.map((stat) => (
            <p key={stat.month}>{stat.month}: {stat.totalRoutines} rutinas</p>
          ))
        ) : (
          <p>No hay datos de rutinas iniciadas globalmente.</p>
        )}
      </div>

      {/* Asignaciones Globales */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-xl font-semibold mb-2">Nuevas Asignaciones a Instructores (Global)</h4>
        {adminOverview.assignments && adminOverview.assignments.length > 0 ? (
          adminOverview.assignments.map((stat) => (
            <p key={stat.month}>{stat.month}: {stat.totalAssignments} asignaciones</p>
          ))
        ) : (
          <p>No hay datos de asignaciones globalmente.</p>
        )}
      </div>

      {/* Seguimientos Globales */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-xl font-semibold mb-2">Seguimientos Realizados por Instructores (Global)</h4>
        {adminOverview.followups && adminOverview.followups.length > 0 ? (
          adminOverview.followups.map((stat) => (
            <p key={stat.month}>{stat.month}: {stat.totalFollowups} seguimientos</p>
          ))
        ) : (
          <p>No hay datos de seguimientos globalmente.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Estadísticas</h2>

      {renderUserStats()}

      {user.role === 'EMPLOYEE' && renderTrainerStats()}

      {user.role === 'ADMIN' && renderAdminStats()}
    </div>
  );
};

export default StatisticsPage;