
import React from 'react';
import { Camera, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScanButtonProps {
  babyName: string;
}

export const ScanButton = ({ babyName }: ScanButtonProps) => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    console.log('Navigating to scan screen');
    navigate('/scan');
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">
          {babyName ? `Scan food for ${babyName}` : 'Scan Any Food Product'}
        </h2>
        <p className="text-pink-100 mb-6">
          Get instant safety ratings and personalized recommendations
        </p>
        <button
          onClick={handleScanClick}
          className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 mx-auto"
        >
          <Camera className="w-6 h-6" />
          <span>Start Scanning</span>
          <Zap className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
