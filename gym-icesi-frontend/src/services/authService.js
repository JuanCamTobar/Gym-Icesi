import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

const register = (name, email, password, role, department, program) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    role,
    department,
    program,
  });
};

const login = (email, password) => {
  return axios
    .post(`${API_URL}/login`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;