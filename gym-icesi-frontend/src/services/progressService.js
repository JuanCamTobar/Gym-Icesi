import axios from 'axios';

const API_URL = 'http://localhost:3000/progress';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getProgressByUser = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`, { headers: getAuthHeader() });
};

const getProgressByRoutine = (routineId) => {
  return axios.get(`${API_URL}/routine/${routineId}`, { headers: getAuthHeader() });
};

const progressService = {
  getProgressByUser,
  getProgressByRoutine,
};

export default progressService;
