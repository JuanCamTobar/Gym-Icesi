import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Panel de Administración
        </h2>
        <p className="text-center text-lg text-gray-700 mb-10">Bienvenido, Administrador. Selecciona una opción para gestionar el sistema.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center p-6 bg-indigo-100 rounded-xl shadow-md hover:bg-indigo-200 transition-all duration-300 ease-in-out transform hover:scale-105 text-indigo-800 font-semibold text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.165-1.294-.478-1.857m0 0a5.002 5.002 0 00-9.044 0M9 20H4v-2a3 3 0 015-2.236M9 20v-2a3 3 0 015-2.236M12 11a3 3 0 100-6 3 3 0 000 6zm-4.5 5a4.5 4.5 0 119 0H12a4.5 4.5 0 01-4.5 0z" />
            </svg>
            Gestión de Usuarios
          </Link>

          <Link
            to="/admin/trainers"
            className="flex flex-col items-center justify-center p-6 bg-green-100 rounded-xl shadow-md hover:bg-green-200 transition-all duration-300 ease-in-out transform hover:scale-105 text-green-800 font-semibold text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-3a4 4 0 11-8 0 4 4 0 018 0zM12 15v2m-2 0H7M2 20h10v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2z" />
            </svg>
            Gestión de Entrenadores
          </Link>

          <Link
            to="/admin/statistics"
            className="flex flex-col items-center justify-center p-6 bg-purple-100 rounded-xl shadow-md hover:bg-purple-200 transition-all duration-300 ease-in-out transform hover:scale-105 text-purple-800 font-semibold text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Ver Estadísticas
          </Link>

          <Link
            to="/admin/reports"
            className="flex flex-col items-center justify-center p-6 bg-red-100 rounded-xl shadow-md hover:bg-red-200 transition-all duration-300 ease-in-out transform hover:scale-105 text-red-800 font-semibold text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Reportes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;