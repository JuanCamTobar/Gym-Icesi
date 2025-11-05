import axios from 'axios';

const API_URL = 'http://localhost:3000/predefined-routines';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getPredefinedRoutines = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const predefinedRoutineService = {
  getPredefinedRoutines,
};

export default predefinedRoutineService;
