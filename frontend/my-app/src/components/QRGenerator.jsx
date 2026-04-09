// src/components/QRGenerator.jsx
import React from 'react';

const QRGenerator = ({ qrDataURL, sessionCode }) => {
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = `qr-attendance-${sessionCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-beachside-sand p-6 rounded-xl shadow-hover transition-all">
      <h3 className="text-lg font-semibold mb-4 text-beachside-blue">Session QR Code</h3>
      {qrDataURL ? (
        <>
          <div className="flex justify-center mb-4">
            <img src={qrDataURL} alt="QR Code" className="w-48 h-48 rounded-lg border-4 border-beachside-blue shadow-md" />
          </div>
          <div className="mb-4">
            <p className="text-sm text-beachside-blue font-medium">Session Code: {sessionCode}</p>
          </div>
          <button
            onClick={downloadQRCode}
            className="btn w-full bg-beachside-blue hover:bg-beachside-sky text-white"
          >
            Download QR Code
          </button>
        </>
      ) : (
        <p className="text-beachside-blue">No QR code generated yet</p>
      )}
    </div>
  );
};

export default QRGenerator;