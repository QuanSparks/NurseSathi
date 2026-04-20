import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Jobs from '../pages/Jobs';
import JobDetail from '../pages/JobDetail';
import StudentDashboard from '../pages/StudentDashboard';
import HospitalDashboard from '../pages/HospitalDashboard';
import Profile from '../pages/Profile';
import GoogleAuthSuccess from '../pages/GoogleAuthSuccess';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

      {/* Student protected */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Hospital protected */}
      <Route
        path="/dashboard/hospital"
        element={
          <ProtectedRoute roles={['hospital']}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      {/* Any authenticated user */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
