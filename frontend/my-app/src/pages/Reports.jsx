// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { sessionsAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.list();
      setSessions(response.data.data);
    } catch (error) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceReport = async (sessionId) => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceAPI.report(sessionId);
      setAttendanceData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load attendance report');
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    loadAttendanceReport(session._id);
  };

  const exportToCSV = () => {
    if (!attendanceData) return;
    
    const { session, records } = attendanceData;
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Student Name,Student ID,Email,Attendance Time\n";
    
    // Add data rows
    records.forEach(record => {
      const row = [
        record.student.name,
        record.student.studentId || 'N/A',
        record.student.email,
        new Date(record.createdAt).toLocaleString()
      ].join(',');
      
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance-report-${session.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
    return (
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-secondary text-primary text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>Only teachers and admins can view reports.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-6 text-primary drop-shadow-lg">Attendance Reports</h2>

      {error && (
        <div className="bg-red-500/80 text-white p-4 rounded-lg shadow-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-secondary/30">
            <h3 className="text-lg font-semibold mb-4 text-primary">Select Session</h3>
            
            {loading ? (
              <p className="text-gray-500">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="text-gray-500">No sessions available</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map(session => (
                  <div
                    key={session._id}
                    onClick={() => handleSessionSelect(session)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                      selectedSession?._id === session._id
                        ? 'bg-accent1/10 border-accent1 text-accent1'
                        : 'border-neutral-gray hover:bg-accent1/5 hover:border-accent1/50'
                    }`}
                  >
                    <p className="font-medium text-primary">{session.title}</p>
                    <p className="text-sm text-secondary">{session.course || 'No course specified'}</p>
                    <p className="text-xs text-neutral-dark mt-1">
                      {new Date(session.validFrom).toLocaleDateString()} - {new Date(session.validUntil).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        session.isActive
                          ? 'bg-accent2/20 text-accent2'
                          : 'bg-neutral-gray text-neutral-dark'
                      }`}
                    >
                      {session.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center border border-secondary/30">
              <p className="text-primary/70 py-8">Loading report...</p>
            </div>
          ) : attendanceData ? (
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-secondary/30">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{attendanceData.session.title}</h3>
                  <p className="text-secondary">{attendanceData.session.course || 'No course specified'}</p>
                  <p className="text-sm text-neutral-dark mt-1">
                    {new Date(attendanceData.session.validFrom).toLocaleString()} - {' '}
                    {new Date(attendanceData.session.validUntil).toLocaleString()}
                  </p>
                  <p className="text-sm mt-2 font-medium text-primary">
                    Total Attendance: {attendanceData.records.length} students
                  </p>
                </div>
                <button
                  onClick={exportToCSV}
                  className="bg-accent1 text-primary font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-accent2 transition-all transform hover:scale-105 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>

              {attendanceData.records.length > 0 ? (
                <div className="overflow-auto max-h-[60vh]">
                  <table className="min-w-full divide-y divide-secondary/20">
                    <thead className="bg-secondary/10 sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                          Attendance Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/20">
                      {attendanceData.records.map(record => (
                        <tr key={record._id} className="hover:bg-accent1/10 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {record.student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                            {record.student.studentId || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                            {record.student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {new Date(record.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-primary/70 text-center py-8">No attendance records found for this session.</p>
              )}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-secondary/30">
              <p className="text-primary/70 text-center py-8">
                Select a session to view attendance report
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;