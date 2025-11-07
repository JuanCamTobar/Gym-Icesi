import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoutinesPage from './pages/RoutinesPage';
import AddRoutinePage from './pages/AddRoutinePage';
import EditRoutinePage from './pages/EditRoutinePage';
import StudentsProgressPage from './pages/StudentsProgressPage';
import ManageTrainerExercisesPage from './pages/ManageTrainerExercisesPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';
import UserManagementPage from './pages/UserManagementPage';
import TrainerManagementPage from './pages/TrainerManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />


          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routines"
            element={
              <ProtectedRoute>
                <RoutinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-routine"
            element={
              <ProtectedRoute>
                <AddRoutinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-routine/:id"
            element={
              <ProtectedRoute>
                <EditRoutinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <AdminRoute>
                <TrainerManagementPage />
              </AdminRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ReportsPage />
            }
          />
          <Route
            path="/trainer/students-progress"
            element={
              <ProtectedRoute>
                <StudentsProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/manage-exercises"
            element={
              <ProtectedRoute>
                <ManageTrainerExercisesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/student-details/:studentUsername"
            element={
              <ProtectedRoute>
                <StudentDetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;