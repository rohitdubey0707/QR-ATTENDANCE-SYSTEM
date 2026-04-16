
// src/pages/Sessions.jsx
import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../services/api';
import QRGenerator from '../components/QRGenerator';
import { useAuth } from '../context/AuthContext';

const toIsoString = (value) => new Date(value).toISOString();

 const Sessions = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    validFrom: '',
    validUntil: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      const sessionPayload = {
        ...formData,
        validFrom: toIsoString(formData.validFrom),
        validUntil: toIsoString(formData.validUntil),
      };
      const response = await sessionsAPI.create(sessionPayload);
      setSessions([response.data.data, ...sessions]);
      setFormData({
        title: '',
        course: '',
        validFrom: '',
        validUntil: '',
      });
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create session');
    }
  };

  const handleCloseSession = async (id) => {
    try {
      await sessionsAPI.close(id);
      loadSessions(); // Reload sessions to update status
    } catch (error) {
      setError('Failed to close session');
    }
  };

  const handleGenerateQR = async (session) => {
    try {
      setError('');
      const response = await sessionsAPI.getQR(session._id);
      setQrData(response.data.data);
      setSelectedSession(session);
    } catch (error) {
      setError('Failed to generate QR code');
    }
  };

  if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
    return (
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-red-500 text-beachside-blue text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>Only teachers and admins can manage sessions.</p>
      </div>
    );
  }

  return (
    <div className="pt-10">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-4xl font-extrabold text-black drop-shadow-lg">Sessions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-3 font-bold px-6 py-3 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-primary/50 ${
            showForm
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-400 animate-pulse'
              : 'bg-gradient-to-r from-accent1 to-accent2 text-white hover:from-accent2 hover:to-pink-500 focus:ring-accent2 hover:shadow-accent1/50'
          }`}
        >
          {showForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create New Session
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/80 text-white p-4 rounded-lg shadow-lg mb-4">
          {error}
        </div>
      )}

      {showForm && (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6">
          <h3 className="text-xl font-semibold mb-4 text-beachside-blue">Create New Session</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-beachside-blue text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue placeholder-beachside-blue/70"
                />
              </div>

              <div>
                <label className="block text-beachside-blue text-sm font-bold mb-2" htmlFor="course">
                  Course
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue placeholder-beachside-blue/70"
                />
              </div>

              <div>
                <label className="block text-beachside-blue text-sm font-bold mb-2" htmlFor="validFrom">
                  Valid From
                </label>
                <input
                  id="validFrom"
                  name="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue"
                />
              </div>

              <div>
                <label className="block text-beachside-blue text-sm font-bold mb-2" htmlFor="validUntil">
                  Valid Until
                </label>
                <input
                  id="validUntil"
                  name="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-beachside-green text-black font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-opacity-80 transition-all transform hover:scale-105"
            >
              Create Session
            </button>
          </form>
        </div>
      )}

      {qrData && selectedSession && (
        <div className="mb-6">
          <QRGenerator 
            qrDataURL={qrData.qrDataURL} 
            sessionCode={qrData.code} 
          />
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center">No sessions found</div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full divide-y divide-beachside-blue/20">
              <thead className="bg-beachside-blue/20 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Valid From
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beachside-blue/20">
              {sessions.map((session) => (
                <tr key={session._id} className="hover:bg-beachside-sky/20 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-beachside-blue">{session.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{session.course || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(session.validFrom).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(session.validUntil).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.isActive ? 'bg-beachside-green/30 text-green-900' : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {session.isActive ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleGenerateQR(session)}
                      className="text-beachside-blue hover:text-beachside-sky font-semibold transition-colors"
                    >
                      QR Code
                    </button>
                    {session.isActive && (
                      <button
                        onClick={() => handleCloseSession(session._id)}
                        className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
                  </table>
          </div>
        )}
              </div>
            </div>
          );
        }
        export default Sessions;
