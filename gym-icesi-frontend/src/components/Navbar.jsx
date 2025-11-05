import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // Import the logo

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold flex items-center">
          <img src={logo} alt="Gym Icesi Logo" className="h-20 w-20 mr-2" />
          <span className="text-2xl font-extrabold tracking-wide text-white-400">Gym Icesi</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <span className="text-2xl font-extrabold tracking-wide text-white-400">Dashboard</span>
              </Link>
              <Link to="/routines" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <span className="text-2xl font-extrabold tracking-wide text-white-400">Routines</span>
              </Link>
              <Link to="/progress" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <span className="text-2xl font-extrabold tracking-wide text-white-400">Progress</span>
              </Link>
              {user.user.role === 'admin' && (
                <Link to="/admin" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
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
              <Link to="/login" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <span className="text-2xl font-extrabold tracking-wide text-white-400">Login</span>
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                <span className="text-2xl font-extrabold tracking-wide text-white-400">Register</span>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col space-y-4">
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                    <span className="text-2xl font-extrabold tracking-wide text-white-400">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/routines" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                    <span className="text-2xl font-extrabold tracking-wide text-white-400">Routines</span>
                  </Link>
                </li>
                <li>
                  <Link to="/progress" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                    <span className="text-2xl font-extrabold tracking-wide text-white-400">Progress</span>
                  </Link>
                </li>
                {user.user.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;