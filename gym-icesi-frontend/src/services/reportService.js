import axios from 'axios';

const API_URL = 'http://localhost:3000/reports';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getTopUsers = () => {
  return axios.get(`${API_URL}/top-users`, { headers: getAuthHeader() });
};

const getTrainerPerformance = () => {
  return axios.get(`${API_URL}/trainer-performance`, { headers: getAuthHeader() });
};

const reportService = {
  getTopUsers,
  getTrainerPerformance,
};

export default reportService;
