import axios from 'axios';

const API_URL = 'http://localhost:3000/progress';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const getProgressByRoutine = (routineId) => {
  return axios.get(`${API_URL}/routine/${routineId}`, { headers: getAuthHeader() });
};

const recordDailyProgress = (progressData) => {
  return axios.post(API_URL, progressData, { headers: getAuthHeader() });
};

const getProgressByRoutineAndStudent = (routineId, studentUsername) => {
  return axios.get(`${API_URL}/routine/${routineId}/student/${studentUsername}`, { headers: getAuthHeader() });
};

const addComment = (progressId, comment) => {
  return axios.post(`${API_URL}/${progressId}/comment`, { comment }, { headers: getAuthHeader() });
};

const progressService = {
  getProgressByRoutine,
  recordDailyProgress,
  getProgressByRoutineAndStudent,
  addComment,
};

export default progressService;
