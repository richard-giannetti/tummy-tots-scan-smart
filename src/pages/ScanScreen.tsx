
import React, { useState } from 'react';
import { Camera, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useScanTracking } from '@/hooks/useScanTracking';
import { ScanService } from '@/services/scanService';
import { MESSAGES, ROUTES } from '@/constants/app';
import ScanLoadingScreen from '@/components/ScanLoadingScreen';
import { BarcodeScannerComponent } from 'react-qr-barcode-scanner';

const ScanScreen = () => {
  const navigate = useNavigate();
  const { recordScan } = useScanTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string>('');

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setScanError('');
    setScannedCode('');
  };

  const handleStopCamera = () => {
    setIsCameraActive(false);
  };

  const handleScanSuccess = (code: string) => {
    console.log('Barcode scanned successfully:', code);
    setScannedCode(code);
    setIsCameraActive(false);
    
    toast({
      title: "Barcode Detected!",
      description: `Found barcode: ${code}`,
    });
  };

  const handleScanError = (error: any) => {
    console.error('Scan error:', error);
    setScanError('Failed to access camera. Please check permissions.');
  };

  const handleProcessScan = async () => {
    if (!scannedCode) {
      toast({
        title: "No Barcode",
        description: "Please scan a barcode first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
  };

  const handleLoadingComplete = async () => {
    try {
      // Try to get real product data from Open Food Facts
      const productData = await ScanService.getProductByBarcode(scannedCode);
      
      let scanResult;
      if (productData) {
        // Calculate score for real product
        scanResult = ScanService.calculateHealthyTummiesScore(productData, 8); // Default 8 months
        console.log('Real product found and analyzed:', scanResult);
      } else {
        // Fall back to mock data if product not found
        scanResult = ScanService.generateMockScanResult();
        console.log('Product not found, using mock data:', scanResult);
        
        toast({
          title: "Product Not Found",
          description: "Using sample data for demonstration",
        });
      }
      
      // Record the scan
      await recordScan(scanResult.healthyTummiesScore);
      
      // Navigate to scan result screen with the result data
      navigate('/scan-result', { 
        state: { 
          scanResult,
          barcode: scannedCode 
        }
      });
    } catch (error) {
      console.error('Error processing scan:', error);
      toast({
        title: "Error",
        description: "Failed to process scan. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTestScan = async () => {
    setIsLoading(true);
  };

  const handleTestLoadingComplete = () => {
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
    return <ScanLoadingScreen onComplete={scannedCode ? handleLoadingComplete : handleTestLoadingComplete} />;
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
        <div className="w-full space-y-6">
          
          {/* Camera Scanner Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Scan Barcode</h2>
            
            {!isCameraActive && !scannedCode && (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-12 h-12 text-pink-600" />
                </div>
                <p className="text-gray-600">Position the barcode within the camera view</p>
                <button
                  onClick={handleStartCamera}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  Start Camera
                </button>
              </div>
            )}

            {isCameraActive && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <BarcodeScannerComponent
                    width="100%"
                    height="100%"
                    onUpdate={(err, result) => {
                      if (result) {
                        handleScanSuccess(result.getText());
                      } else if (err) {
                        handleScanError(err);
                      }
                    }}
                  />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-xl">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-pink-500 rounded-lg"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Position barcode in the highlighted area</p>
                  <button
                    onClick={handleStopCamera}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Stop Camera
                  </button>
                </div>
              </div>
            )}

            {scanError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-700 text-sm">{scanError}</p>
                <button
                  onClick={handleStartCamera}
                  className="mt-2 text-red-600 underline text-sm hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {scannedCode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Barcode Detected!</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Scanned Code:</p>
                  <p className="font-mono text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded border">
                    {scannedCode}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleProcessScan}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
                  >
                    Analyze Product
                  </button>
                  <button
                    onClick={() => {
                      setScannedCode('');
                      handleStartCamera();
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Test Scan Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Demo Mode</h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Can't scan right now? Try our demo with sample data
            </p>
            <button
              onClick={handleTestScan}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
            >
              Try Demo Scan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanScreen;
