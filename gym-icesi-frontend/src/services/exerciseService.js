import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getExercises = () => {
  return axios.get(`${API_URL}/exercises`, { headers: getAuthHeader() });
};

const createExercise = (exerciseData) => {
  return axios.post(`${API_URL}/exercises`, exerciseData, { headers: getAuthHeader() });
};

const exerciseService = {
  getExercises,
  createExercise,
};

export default exerciseService;
