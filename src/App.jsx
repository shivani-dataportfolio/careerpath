import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
import CareerRecommendations from './pages/dashboard/CareerRecommendations';
import ResumeUpload from './pages/dashboard/ResumeUpload';
import Profile from './pages/dashboard/Profile';
import RoleDetails from './pages/dashboard/RoleDetails';
import RoleSelection from './pages/dashboard/RoleSelection';

import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="upload" element={<ResumeUpload />} />
          <Route path="career" element={<CareerRecommendations />} />
          <Route path="select-role" element={<RoleSelection />} />
          <Route path="role/:roleId" element={<RoleDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
