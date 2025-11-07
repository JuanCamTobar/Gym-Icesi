import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  console.log('Current user in Navbar:', user);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Gym Icesi Logo" className="h-14 w-14 mr-2" />
          <span className="text-2xl font-extrabold tracking-wide text-white">Gym Icesi</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white/90 hover:text-indigo-300 text-base font-medium">Dashboard</Link>
              <Link to="/routines" className="text-white/90 hover:text-indigo-300 text-base font-medium">Routines</Link>
              <Link to="/progress" className="text-white/90 hover:text-indigo-300 text-base font-medium">Progress</Link>
              <Link to="/statistics" className="text-white/90 hover:text-indigo-300 text-base font-medium">Statistics</Link>
              {user?.user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-white/90 hover:text-indigo-300 text-base font-medium">Admin</Link>
              )}
              {user?.user?.role === 'EMPLOYEE' && user?.user?.employee_type === 'Instructor' && (
                <>
                  <Link to="/trainer/students-progress" className="text-white/90 hover:text-indigo-300 text-base font-medium">Estudiantes</Link>
                  <Link to="/trainer/manage-exercises" className="text-white/90 hover:text-indigo-300 text-base font-medium">Gestionar Ejercicios</Link>
                </>
              )}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/90 hover:text-indigo-300 text-base font-medium">Login</Link>

            </>
          )}
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white focus:outline-none transition-transform duration-200 transform hover:scale-110"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-3">
            {user ? (
              <>
                <li><Link to="/dashboard" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Dashboard</Link></li>
                <li><Link to="/routines" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Routines</Link></li>
                <li><Link to="/progress" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Progress</Link></li>
                <li><Link to="/statistics" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Statistics</Link></li>
                {user?.user?.role === 'ADMIN' && (
                  <li><Link to="/admin" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Admin</Link></li>
                )}
                {user?.user?.role === 'EMPLOYEE' && user?.user?.employee_type === 'Instructor' && (
                  <>
                    <li><Link to="/trainer/students-progress" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Estudiantes</Link></li>
                    <li><Link to="/trainer/manage-exercises" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Gestionar Ejercicios</Link></li>
                  </>
                )}
                <li>
                  <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-white hover:text-indigo-300 block px-3 py-2 text-base font-medium">Login</Link></li>

              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
