import axios from 'axios';

const API_URL = 'http://localhost:3000/reports';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

const handleRequest = async (method, url) => {
  try {
    const response = await axios({ method, url, headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Admin Reports
const getAdminOverviewReport = () => {
  return handleRequest('get', `${API_URL}/admin/overview`);
};

const getAdminUserActivityReport = () => {
  return handleRequest('get', `${API_URL}/admin/user-activity`);
};

// Trainer Reports
const getTrainerStudentOverview = () => {
  return handleRequest('get', `${API_URL}/trainer/student-overview`);
};

const getTrainerStudentProgress = () => {
  return handleRequest('get', `${API_URL}/trainer/student-progress`);
};

// User Reports
const getUserConsistencyReport = () => {
  return handleRequest('get', `${API_URL}/user/consistency`);
};

const getUserTotalRoutinesCompleted = () => {
  return handleRequest('get', `${API_URL}/user/total-routines`);
};

const reportService = {
  getAdminOverviewReport,
  getAdminUserActivityReport,
  getTrainerStudentOverview,
  getTrainerStudentProgress,
  getUserConsistencyReport,
  getUserTotalRoutinesCompleted,
};

export default reportService;
