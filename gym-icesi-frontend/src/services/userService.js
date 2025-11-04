import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

const getUsers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getUser = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createUser = (userData) => {
  return axios.post(API_URL, userData, { headers: getAuthHeader() });
};

const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/${id}`, userData, { headers: getAuthHeader() });
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
