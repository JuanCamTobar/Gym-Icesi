import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getUsers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getUser = (username) => {
  return axios.get(`${API_URL}/${username}`, { headers: getAuthHeader() });
};

const assignTrainer = (username, trainerId) => {
  return axios.put(`${API_URL}/${username}/assign-trainer`, { trainerId }, { headers: getAuthHeader() });
};

const userService = {
  getUsers,
  getUser,
  assignTrainer,
};

export default userService;
