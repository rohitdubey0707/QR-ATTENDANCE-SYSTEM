// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Display a success message if redirected from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent the message from reappearing
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      setSuccessMessage('');
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to log in');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-secondary/30">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Welcome Back</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-800 px-4 py-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-800 px-4 py-3 rounded-lg mb-6 text-center">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-primary text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-primary text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/50 border border-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 text-primary placeholder-secondary/70"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent1 hover:bg-accent2 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 disabled:bg-accent1/50"
        >
          {loading  ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-accent1 hover:text-accent2">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;