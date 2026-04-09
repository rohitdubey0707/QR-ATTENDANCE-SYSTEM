// src/components/QRScanner.jsx
import React, { useState } from 'react';
import QrScanner from 'qr-scanner';
import { attendanceAPI } from '../services/api';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const startScanning = async () => {
    try {
      setScanning(true);
      setCameraError('');
      
      const videoElement = document.getElementById('qr-scanner');
      const scanner = new QrScanner(
        videoElement,
        (result) => {
          scanner.stop();
          setScanning(false);
          
          try {
            const { sessionCode } = JSON.parse(result.data);
            attendanceAPI.mark(sessionCode)
              .then(response => {
                onScanSuccess(response.data);
              })
              .catch(error => {
                onScanError(error.response?.data?.message || 'Failed to mark attendance');
              });
          } catch (e) {
            onScanError('Invalid QR code format');
          }
        },
        { highlightScanRegion: true, highlightCodeOutline: true }
      );
      
      await scanner.start();
    } catch (error) {
      setCameraError('Camera access denied or not available');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="bg-beachside-sand p-6 rounded-xl shadow-hover transition-all">
      <h3 className="text-lg font-semibold mb-4 text-beachside-blue">Scan QR Code</h3>
      {cameraError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {cameraError}
        </div>
      )}
      <div className="relative">
        <video
          id="qr-scanner"
          className="w-full h-64 bg-beachside-sky rounded-lg border-2 border-beachside-blue"
          style={{ display: scanning ? 'block' : 'none' }}
        ></video>
        {!scanning && (
          <div className="w-full h-64 bg-beachside-sky rounded-lg flex items-center justify-center border-2 border-beachside-blue">
            <p className="text-beachside-blue">Camera preview will appear here</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="btn bg-gradient-to-r from-beachside-blue via-blue-400 to-beachside-sky text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
            </svg>
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="btn bg-gradient-to-r from-beachside-blue via-blue-400 to-beachside-sky text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;