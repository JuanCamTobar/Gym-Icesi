import axios from 'axios';

const API_URL = 'http://localhost:3000/custom-routines';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getCustomRoutines = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const createCustomRoutine = (name, exerciseIds = []) => {
  return axios.post(API_URL, { name, exercises: exerciseIds }, { headers: getAuthHeader() });
};

const createCustomRoutineWithExercises = (name, exerciseIds) => {
  return axios.post(API_URL, { name, exercises: exerciseIds }, { headers: getAuthHeader() });
};

const updateCustomRoutine = (id, name) => {
  return axios.put(`${API_URL}/${id}`, { name }, { headers: getAuthHeader() });
};

const deleteCustomRoutine = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const adoptPredefinedRoutine = (predefinedRoutineId) => {
  return axios.post(`${API_URL}/adopt`, { predefinedRoutineId }, { headers: getAuthHeader() });
};

const customRoutineService = {
  getCustomRoutines,
  createCustomRoutine,
  updateCustomRoutine,
  deleteCustomRoutine,
  adoptPredefinedRoutine,
  createCustomRoutineWithExercises,
};

export default customRoutineService;