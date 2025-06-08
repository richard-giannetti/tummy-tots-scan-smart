
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/app';

const ScanHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          aria-label="Go back to homepage"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Food Scanner</h1>
      </div>
    </header>
  );
};

export default ScanHeader;
