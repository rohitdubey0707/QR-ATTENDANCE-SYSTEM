// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="progress-bar" style={{width: '100%', background: 'linear-gradient(90deg, #355C7D, #725A7A, #C56C86, #FF7582)'}}></div>
      </div>
      <div className="glass-bg w-full max-w-6xl mx-auto p-6 md:p-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary drop-shadow-lg tracking-tight">Dashboard</h1>
        <p className="text-lg text-secondary mb-10">Welcome back, {currentUser.name}!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* Welcome Card */}
          <div className="group relative overflow-hidden bg-gray-200/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-accent1 flex flex-col items-center hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
            <div className="bg-accent1 text-black rounded-full p-4 mb-5 shadow-lg transform transition-transform duration-300 group-hover:scale-110 animated-pulse">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}><path strokeLinecap='round' strokeLinejoin='round' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary drop-shadow">Welcome, {currentUser.name}!</h3>
            <p className="text-secondary font-medium capitalize">Role: {currentUser.role}</p>
            <p className="text-secondary font-medium break-all">{currentUser.email}</p>
          </div>
          {/* Quick Actions Card */}
          <div className="group relative overflow-hidden bg-gray-200/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-accent1 flex flex-col items-center hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
            <div className="bg-accent1 text-black rounded-full p-4 mb-5 shadow-lg transform transition-transform duration-300 group-hover:scale-110 animated-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-primary drop-shadow">Quick Actions</h3>
            <ul className="space-y-3 w-full">
              {currentUser.role === 'student' && (
                <li>
                  <Link to="/attendance" className="flex items-center justify-center w-full text-center bg-red-50 text-red-700 font-semibold py-2 rounded-lg shadow-md hover:bg-red-100 transition-all transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Mark Attendance
                  </Link>
                </li>
              )}
              {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                <li>
                  <Link to="/sessions" className="flex items-center justify-center w-full text-center bg-red-50 text-red-700 font-semibold py-2 rounded-lg shadow-md hover:bg-red-100 transition-all transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Manage Sessions
                  </Link>
                </li>
              )}
              {currentUser.role === 'admin' && (
                <li>
                  <Link to="/students" className="flex items-center justify-center w-full text-center bg-red-50 text-red-700 font-semibold py-2 rounded-lg shadow-md hover:bg-red-100 transition-all transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>
                    View Students
                  </Link>
                </li>
              )}
              <li>
                <Link to="/reports" className="flex items-center justify-center w-full text-center bg-red-50 text-red-700 font-semibold py-2 rounded-lg shadow-md hover:bg-red-100 transition-all transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  View Reports
                </Link>
              </li>
            </ul>
          </div>
          {/* System Status Card */}
          <div className="group relative overflow-hidden bg-gray-200/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-accent2 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-[1.03] transition-all duration-300">
            <div className="bg-accent2 text-black rounded-full p-4 mb-5 shadow-lg transform transition-transform duration-300 group-hover:scale-110 animated-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary drop-shadow">System Status</h3>
            <p className="text-green-600 font-semibold text-xl">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;