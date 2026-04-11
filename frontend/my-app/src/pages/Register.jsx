// src/pages/Register.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowedRoles, setAllowedRoles] = useState({
    student: true,
    teacher: true,
    admin: false,
  });
  
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  const canRegisterPrivilegedUsers = currentUser?.role === 'admin';

  useEffect(() => {
    const loadRegisterStatus = async () => {
      try {
        const response = await authAPI.getRegisterStatus();
        setAllowedRoles(response.data.data.roles);
      } catch (error) {
        setAllowedRoles({
          student: true,
          teacher: true,
          admin: false,
        });
      }
    };

    loadRegisterStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

// In your handleSubmit function, update the userData preparation:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirmPassword) {
    return setError('Passwords do not match');
  }

  if (formData.role === 'student' && !formData.studentId.trim()) {
    return setError('Student ID is required for student registration');
  }

  if (!canRegisterPrivilegedUsers && !allowedRoles[formData.role]) {
    return setError('Only an administrator can register that role right now');
  }
  
  try {
    setError('');
    setLoading(true);
    
    // Prepare user data based on role
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    
    // Only include studentId if registering as student
    if (formData.role === 'student') {
      userData.studentId = formData.studentId;
    }
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } else {
      setError(result.message);
    }
  } catch (error) {
    setError('Failed to create an account');
  }
  
  setLoading(false);
};

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-secondary/30">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Create an Account</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-primary text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
            />
          </div>
          <div>
            <label className="block text-primary text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-primary text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              {(canRegisterPrivilegedUsers || allowedRoles.admin) && <option value="admin">Admin</option>}
            </select>
            {!canRegisterPrivilegedUsers && !allowedRoles.admin && (
              <p className="mt-2 text-xs text-secondary">
                Teachers can self-register. Administrator accounts must be created by an administrator.
              </p>
            )}
          </div>
          
          {formData.role === 'student' && (
            <div>
              <label className="block text-primary text-sm font-bold mb-2" htmlFor="studentId">
                Student ID
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-primary text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
            />
          </div>
          <div>
            <label className="block text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent1 hover:bg-accent2 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 disabled:bg-accent1/50"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent1 hover:text-accent2">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
