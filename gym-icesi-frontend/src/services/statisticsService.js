import axios from 'axios';

const API_URL = 'http://localhost:3000/statistics';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getUserStatistics = (month) => {
  return axios.get(`${API_URL}/users/${month}`, { headers: getAuthHeader() });
};

const getTrainerStatistics = (month) => {
  return axios.get(`${API_URL}/trainers/${month}`, { headers: getAuthHeader() });
};

const statisticsService = {
  getUserStatistics,
  getTrainerStatistics,
};

export default statisticsService;
