// src/pages/Students.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Students = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: 'student',
    q: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...searchFilters };
      const response = await usersAPI.list(params);
      setStudents(response.data.data);
    } catch (error) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadStudents(newFilters);
  };

  const handleSearchInputChange = (e) => {
    setFilters({ ...filters, q: e.target.value });
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-red-500 text-beachside-blue text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>Only admins can manage students.</p>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Student Management</h2>

      {error && (
        <div className="bg-red-500/80 text-white p-4 rounded-lg shadow-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name, email, or ID..."
                value={filters.q}
                onChange={handleSearchInputChange}
                className="w-full px-4 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue placeholder-beachside-blue/70"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-beachside-blue/60 hover:text-beachside-blue"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-beachside-blue">
              Status:
            </label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-white/50 border border-beachside-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-beachside-sky text-beachside-blue"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            {filters.q ? 'No students found matching your search' : 'No students found'}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full divide-y divide-beachside-blue/20">
              <thead className="bg-beachside-blue/20 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-beachside-blue uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beachside-blue/20">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-beachside-sky/20 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.studentId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-beachside-blue flex items-center justify-center text-black font-semibold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-beachside-blue">{student.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{student.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.active
                          ? 'bg-beachside-green/30 text-green-900'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {student.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="mt-4 text-sm text-white/80">
          Showing {students.length} students
        </div>
      )}
    </div>
  );
};

export default Students;