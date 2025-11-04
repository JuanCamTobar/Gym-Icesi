import axios from 'axios';

const API_URL = 'http://localhost:3000/routines';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getRoutines = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const createRoutine = (name) => {
  return axios.post(API_URL, { name }, { headers: getAuthHeader() });
};

const updateRoutine = (id, name) => {
  return axios.put(`${API_URL}/${id}`, { name }, { headers: getAuthHeader() });
};

const deleteRoutine = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const registerProgress = (routineId, date, reps, time, effort) => {
  return axios.post(
    `${API_URL}/${routineId}/progress`,
    { date, reps, time, effort },
    { headers: getAuthHeader() }
  );
};

const routineService = {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  registerProgress,
};

export default routineService;
