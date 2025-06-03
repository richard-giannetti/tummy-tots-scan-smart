
import React, { useState } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useScanTracking } from '@/hooks/useScanTracking';
import { ScanService } from '@/services/scanService';
import { MESSAGES, ROUTES } from '@/constants/app';
import ScanLoadingScreen from '@/components/ScanLoadingScreen';

const ScanScreen = () => {
  const navigate = useNavigate();
  const { recordScan } = useScanTracking();
  const [isLoading, setIsLoading] = useState(false);

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  const handleTestScan = async () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    const mockResult = ScanService.generateMockScanResult();
    
    toast({
      title: MESSAGES.SCAN.TEST_COMPLETE,
      description: `${mockResult.product.productName} scored ${mockResult.healthyTummiesScore}/100`,
    });
    
    // Navigate to scan result screen with the result data
    navigate('/scan-result', { 
      state: { scanResult: mockResult }
    });
  };

  // Show loading screen when scanning
  if (isLoading) {
    return <ScanLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header with back button */}
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

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8">
          {/* Large camera placeholder icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center mb-8 animate-pulse">
            <Camera className="w-16 h-16 text-pink-600" />
          </div>

          {/* Title and subtitle */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Scan Food</h2>
            <p className="text-gray-600 text-lg">{MESSAGES.SCAN.CAMERA_COMING_SOON}</p>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {MESSAGES.SCAN.WORKING_ON_INTEGRATION}
            </p>
          </div>

          {/* Test scan button */}
          <div className="pt-8">
            <button
              onClick={handleTestScan}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-colors flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              <Camera className="w-6 h-6" />
              <span>Test Scan Result</span>
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Click to simulate a scan and see how results will look
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanScreen;
