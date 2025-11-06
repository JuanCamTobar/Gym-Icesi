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

const getCustomRoutineById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const updateCustomRoutine = (id, name, exercises) => {
  return axios.put(`${API_URL}/${id}`, { name, exercises }, { headers: getAuthHeader() });
};

const deleteCustomRoutine = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const adoptPredefinedRoutine = (predefinedRoutineId) => {
  return axios.post(`${API_URL}/adopt`, { predefinedRoutineId }, { headers: getAuthHeader() });
};

const getCustomRoutinesByStudent = (studentUsername) => {
  return axios.get(`${API_URL}/student/${studentUsername}`, { headers: getAuthHeader() });
};

const customRoutineService = {
  getCustomRoutines,
  getCustomRoutineById,
  createCustomRoutine,
  updateCustomRoutine,
  deleteCustomRoutine,
  adoptPredefinedRoutine,
  createCustomRoutineWithExercises,
  getCustomRoutinesByStudent,
};

export default customRoutineService;