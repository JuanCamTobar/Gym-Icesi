import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center text-gray-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-700 leading-tight mb-4">
          Transforma tu Cuerpo, Transforma tu Vida
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Tu gimnasio personal en línea. Rutinas personalizadas, seguimiento de progreso y entrenadores expertos a tu alcance.
        </p>
        <div className="space-x-4">
          <button
            onClick={handleLoginClick}
            className="bg-white text-indigo-600 border border-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-bold text-indigo-700 mb-3">Rutinas Personalizadas</h3>
          <p className="text-gray-600">Accede a planes de entrenamiento diseñados para tus objetivos y nivel de fitness.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-bold text-indigo-700 mb-3">Seguimiento de Progreso</h3>
          <p className="text-gray-600">Registra tus avances, visualiza tu mejora y mantente motivado.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-bold text-indigo-700 mb-3">Entrenadores Expertos</h3>
          <p className="text-gray-600">Recibe recomendaciones y apoyo de profesionales certificados.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;