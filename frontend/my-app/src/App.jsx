// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Sessions from './pages/Sessions';
import Students from './pages/Students';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full flex flex-col">
          <div className="px-4 pt-6 pb-2"><Navbar /></div>
          <main className="container mx-auto px-4 py-10 flex-1 flex flex-col justify-center">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <PrivateRoute>
                    <Attendance />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <PrivateRoute>
                    <Sessions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrivateRoute>
                    <Students />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;