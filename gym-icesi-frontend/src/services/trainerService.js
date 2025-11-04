import axios from 'axios';

const API_URL = 'http://localhost:3000/trainers';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getTrainers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const createTrainer = (trainerData) => {
  return axios.post(API_URL, trainerData, { headers: getAuthHeader() });
};

const updateTrainer = (id, trainerData) => {
  return axios.put(`${API_URL}/${id}`, trainerData, { headers: getAuthHeader() });
};

const deleteTrainer = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const getTrainerUsers = (id) => {
  return axios.get(`${API_URL}/${id}/users`, { headers: getAuthHeader() });
};

const trainerService = {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerUsers,
};

export default trainerService;
