// src/pages/Attendance.jsx
import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { currentUser } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  const handleScanSuccess = (data) => {
    setScanResult(data);
    setError('');
  };

  const handleScanError = (message) => {
    setError(message);
    setScanResult(null);
  };

  if (currentUser.role !== 'student') {
    return (
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-red-500 text-beachside-blue text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>Only students can mark attendance.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Mark Attendance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <QRScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
        </div>
        
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-beachside-blue">Scan Result</h3>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {scanResult ? (
            <div className="bg-beachside-green/30 border border-green-500 text-green-900 px-4 py-3 rounded-lg">
                <p className="font-semibold">Attendance marked successfully!</p>
                <p className="mt-2">Session: {scanResult.data.session}</p>
                <p>Student: {scanResult.data.student}</p>
                <p>Date: {new Date(scanResult.data.scannedAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-beachside-blue/70">Scan a QR code to mark attendance</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;