
import React from 'react';
import ScanLoadingScreen from '@/components/ScanLoadingScreen';
import { EnhancedCameraPermissionManager } from '@/components/EnhancedCameraPermissionManager';
import ScanHeader from '@/components/scan/ScanHeader';
import BarcodeScanner from '@/components/scan/BarcodeScanner';
import DemoScanSection from '@/components/scan/DemoScanSection';
import { useScanLogic } from '@/hooks/useScanLogic';

const ScanScreen = () => {
  const {
    isLoading,
    scannedCode,
    isCameraActive,
    scanError,
    hasPermission,
    handlePermissionGranted,
    handlePermissionDenied,
    handleStartCamera,
    handleStopCamera,
    handleScanSuccess,
    handleScanError,
    handleProcessScan,
    handleLoadingComplete,
    handleTestScan,
    handleTestLoadingComplete,
    handleScanAgain
  } = useScanLogic();

  // Show loading screen when scanning
  if (isLoading) {
    return <ScanLoadingScreen onComplete={scannedCode ? handleLoadingComplete : handleTestLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <ScanHeader />

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full space-y-6">
          
          {/* Camera Scanner Section with Enhanced Permission Management */}
          <EnhancedCameraPermissionManager
            onPermissionGranted={handlePermissionGranted}
            onPermissionDenied={handlePermissionDenied}
            showPermissionStatus={hasPermission}
          >
            <BarcodeScanner
              isCameraActive={isCameraActive}
              scannedCode={scannedCode}
              scanError={scanError}
              hasPermission={hasPermission}
              onStartCamera={handleStartCamera}
              onStopCamera={handleStopCamera}
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              onProcessScan={handleProcessScan}
              onScanAgain={handleScanAgain}
            />
          </EnhancedCameraPermissionManager>

          {/* Test Scan Section */}
          <DemoScanSection onTestScan={handleTestScan} />
        </div>
      </main>
    </div>
  );
};

export default ScanScreen;
