import React, { useState, useEffect } from 'react';
import statisticsService from '../services/statisticsService';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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
        if (user && user.user) {
          const { role } = user.user;

          // Admin users only need global stats
          if (role === 'ADMIN') {
            const adminRes = await statisticsService.getAdminOverview();
            console.log('1. Datos recibidos del backend (adminOverview):', adminRes.data);
            setAdminOverview(adminRes.data);
          } else {
            const [routinesRes, progressRes] = await Promise.all([
              statisticsService.getUserStartedRoutines(),
              statisticsService.getUserProgressCalendar(selectedMonth),
            ]);
            setUserStartedRoutines(routinesRes.data);
            setUserProgressCalendar(progressRes.data);

            if (role === 'EMPLOYEE') {
              const trainerRes = await statisticsService.getTrainerStats();
              setTrainerStats(trainerRes.data);
            }
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

  // Filter routines for the selected month
  const routinesForSelectedMonth = userStartedRoutines[selectedMonth] || [];

  const renderUserStats = () => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Tus Estadísticas Mensuales</h3>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-indigo-600">Resumen de Actividad</h4>
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
        </div>
      </div>

      {/* Rutinas Iniciadas */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
        <h4 className="text-xl font-semibold mb-2">Rutinas Iniciadas</h4>
        {routinesForSelectedMonth.length > 0 ? (
          <ul>
            {routinesForSelectedMonth.map((routine) => (
              <li key={routine.id} className="ml-4 list-disc py-1">
                {routine.routine_name} ({routine.routine_type}) - {new Date(routine.started_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No has iniciado ninguna rutina en {selectedMonth}.</p>
        )}
      </div>

      {/* Gráfico de Pastel de Progreso */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
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
        <div className="grid md:grid-cols-2 gap-6">
          {trainerStats.map((stats) => (
            <div key={stats.month} className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
            <h4 className="text-xl font-semibold mb-2">Mes: {stats.month}</h4>
            <p>Nuevas Asignaciones: {stats.new_assignments}</p>
            <p>Seguimientos Realizados (Comentarios): {stats.followups}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay estadísticas disponibles como instructor.</p>
      )}
    </div>
  );

  const renderAdminStats = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      routines: 0,
      assignments: 0,
      followups: 0,
    }));

    const monthStr = selectedMonth;

    const routineDataForMonth = adminOverview.routines?.find(r => r.month === monthStr);
    console.log('2a. Datos de rutinas para el mes seleccionado:', routineDataForMonth);
    if (routineDataForMonth?.dailyCounts) {
      routineDataForMonth.dailyCounts.forEach(item => {
        dailyData[item.day - 1].routines = item.count;
      });
    }

    const assignmentDataForMonth = adminOverview.assignments?.find(a => a.month === monthStr);
    console.log('2b. Datos de asignaciones para el mes seleccionado:', assignmentDataForMonth);
    if (assignmentDataForMonth?.dailyCounts) {
      assignmentDataForMonth.dailyCounts.forEach(item => {
        dailyData[item.day - 1].assignments = item.count;
      });
    }

    const followupDataForMonth = adminOverview.followups?.find(f => f.month === monthStr);
    console.log('2c. Datos de seguimientos para el mes seleccionado:', followupDataForMonth);
    if (followupDataForMonth?.dailyCounts) {
      followupDataForMonth.dailyCounts.forEach(item => {
        dailyData[item.day - 1].followups = item.count;
      });
    }

    console.log('3. Datos finales para el gráfico:', dailyData);

    return (
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Panel de Administración (Estadísticas Globales)</h3>
  
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-indigo-600">Resumen de Actividad Global</h4>
            {/* Selector de Mes */}
            <div className="mb-4">
              <label htmlFor="month-select-admin" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar Mes:</label>
              <input
                type="month"
                id="month-select-admin"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 mb-8">
          <h4 className="text-xl font-semibold mb-4">Actividad Diaria del Mes: {selectedMonth}</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Día del Mes', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="routines" fill="#8884d8" name="Rutinas Iniciadas" />
              <Bar dataKey="assignments" fill="#82ca9d" name="Nuevas Asignaciones" />
              <Bar dataKey="followups" fill="#ffc658" name="Seguimientos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Estadísticas</h2>

      {user.user.role === 'ADMIN' ? (
        renderAdminStats()
      ) : (
        <>
          {renderUserStats()}
          {user.user.role === 'EMPLOYEE' && renderTrainerStats()}
        </>
      )}
    </div>
  );
};

export default StatisticsPage;