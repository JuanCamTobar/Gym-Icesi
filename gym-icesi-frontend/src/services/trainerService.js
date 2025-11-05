import axios from 'axios';

const API_URL = 'http://localhost:3000/trainers';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getTrainers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getTrainerUsers = (id) => {
  return axios.get(`${API_URL}/${id}/users`, { headers: getAuthHeader() });
};

const trainerService = {
  getTrainers,
  getTrainerUsers,
};

export default trainerService;
