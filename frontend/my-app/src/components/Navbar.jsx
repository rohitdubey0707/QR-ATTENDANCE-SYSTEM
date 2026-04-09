// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  const navLinkClasses = "block md:inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent1 hover:text-white focus:bg-accent1 focus:text-white";
  const activeStyle = {
    backgroundColor: '#C56C86', // Magenta
    color: '#fff' // White
  };

  return (
    <nav className="bg-primary/95 backdrop-blur-sm text-white shadow-lg fixed top-0 left-0 w-full z-50 border-b-2 border-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-accent1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v1m-6.5-17h2m11 6.5h1M12 20.5v1M4.5 12.5h-1M19.5 12.5h1M12 4.5v-1M6.5 19.5v-2m11-11h-2M6.5 6.5v-2m11 11h-2" />
            </svg>
            QR Attendance System
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-white hover:text-accent1 focus:outline-none focus:text-accent1">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <NavLink to="/" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined}>
                  Dashboard
                </NavLink>
                <NavLink to="/attendance" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined}>
                  Attendance
                </NavLink>
                {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                  <NavLink to="/sessions" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined}>
                    Sessions
                  </NavLink>
                )}
                {currentUser.role === 'admin' && (
                  <NavLink to="/students" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined}>
                    Students
                  </NavLink>
                )}
                <NavLink to="/reports" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined}>
                  Reports
                </NavLink>
                
                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <div>
                    <button 
                      type="button" 
                      className="bg-neutral-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white" 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-9 w-9 rounded-full bg-neutral-white flex items-center justify-center text-primary font-bold text-lg">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  </div>
                  {isUserMenuOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white/95 backdrop-blur-md ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform opacity-100 scale-100 border border-secondary/30"
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                        <div className="px-4 py-2 border-b border-secondary/20">
                          <p className="text-sm font-semibold text-primary" role="none">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate" role="none">
                            {currentUser.email}
                          </p>
                        </div>
                        <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 font-medium" role="menuitem">
                          Logout
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <NavLink to="/login" className="bg-accent1 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-accent2 transition-all transform hover:scale-105" style={({ isActive }) => isActive ? activeStyle : undefined}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser ? (
            <>
              <NavLink to="/" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
              <NavLink to="/attendance" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Attendance</NavLink>
              {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                <NavLink to="/sessions" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Sessions</NavLink>
              )}
              {currentUser.role === 'admin' && (
                <NavLink to="/students" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Students</NavLink>
              )}
              <NavLink to="/reports" className={navLinkClasses} style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Reports</NavLink>
              <div className="border-t border-beachside-sky/20 pt-4 mt-4">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-white flex items-center justify-center text-primary font-bold text-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                    <div className="text-sm font-medium leading-none text-neutral-white/80">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
            </>
          ) : (
            <NavLink to="/login" className="block text-center bg-accent1 text-white font-bold w-full py-3 rounded-lg shadow-md hover:bg-accent2" style={({ isActive }) => isActive ? activeStyle : undefined} onClick={() => setIsOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;