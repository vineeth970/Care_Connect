import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PrescriptionView from './pages/patient/PrescriptionView';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/appointments/:id/prescription" element={<PrescriptionView />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
                <Route path="/doctor" element={<DoctorDashboard />} />
              </Route>
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
          <Chatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

