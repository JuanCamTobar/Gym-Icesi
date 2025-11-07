import axios from 'axios';

const API_URL = 'http://localhost:3000/statistics';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getUserStartedRoutines = () => {
  return axios.get(`${API_URL}/user/routines`, { headers: getAuthHeader() });
};

const getUserProgressCalendar = (month) => {
  return axios.get(`${API_URL}/user/progress-calendar?month=${month}`, { headers: getAuthHeader() });
};

const getTrainerStats = () => {
  return axios.get(`${API_URL}/trainer/my-stats`, { headers: getAuthHeader() });
};

const getAdminOverview = () => {
  return axios.get(`${API_URL}/admin/overview`, { headers: getAuthHeader() });
};

const statisticsService = {
  getUserStartedRoutines,
  getUserProgressCalendar,
  getTrainerStats,
  getAdminOverview,
};

export default statisticsService;