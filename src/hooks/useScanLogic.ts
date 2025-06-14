
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useScanTracking } from '@/hooks/useScanTracking';
import { ScanService } from '@/services/scanService';
import { MESSAGES } from '@/constants/app';

export const useScanLogic = () => {
  const navigate = useNavigate();
  const { recordScan } = useScanTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState(false);

  const handlePermissionGranted = () => {
    console.log('Camera permission granted');
    setHasPermission(true);
    setScanError('');
    
    // Show success message for first-time users
    toast({
      title: "Camera Ready!",
      description: "You can now scan barcodes. Permission will be remembered for next time.",
    });
  };

  const handlePermissionDenied = () => {
    console.log('Camera permission denied');
    setHasPermission(false);
    setIsCameraActive(false);
    setScanError('');
  };

  const handleStartCamera = () => {
    if (!hasPermission) {
      setScanError('Camera permission is required to scan barcodes');
      toast({
        title: "Permission Required",
        description: "Please grant camera permission to start scanning",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Starting camera for scanning');
    setIsCameraActive(true);
    setScanError('');
    setScannedCode('');
  };

  const handleStopCamera = () => {
    console.log('Stopping camera');
    setIsCameraActive(false);
  };

  const handleScanSuccess = (code: string) => {
    console.log('Barcode scanned successfully:', code);
    setScannedCode(code);
    setIsCameraActive(false);
    setScanError('');
    
    // Haptic feedback on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    toast({
      title: "Barcode Detected!",
      description: `Found: ${code}`,
    });
  };

  const handleScanError = (error: any) => {
    console.log('Scan error:', error);
    
    // Only show user-facing errors for significant issues
    if (error?.message && 
        !error.message.includes('No MultiFormat Readers') && 
        !error.message.includes('No barcode detected')) {
      
      console.error('Significant camera error:', error);
      
      let errorMessage = 'Camera scanning error occurred';
      
      if (error.message.includes('not readable') || error.message.includes('in use')) {
        errorMessage = 'Camera is busy or being used by another app';
      } else if (error.message.includes('permission') || error.message.includes('denied')) {
        errorMessage = 'Camera permission was revoked';
        setHasPermission(false);
      }
      
      setScanError(errorMessage);
      toast({
        title: "Scanning Issue",
        description: errorMessage,
        variant: "destructive",
      });
    }
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

    console.log('Processing scanned barcode:', scannedCode);
    setIsLoading(true);
  };

  const handleLoadingComplete = async () => {
    try {
      console.log('=== Starting product analysis for barcode:', scannedCode);
      
      // Step 1: Fetch product data from Open Food Facts
      console.log('Step 1: Fetching product data...');
      const productData = await ScanService.getProductByBarcode(scannedCode);
      console.log('Product data received:', productData ? 'Success' : 'No data');
      
      let scanResult;
      if (productData) {
        console.log('Step 2: Calculating Healthy Tummies Score...');
        scanResult = await ScanService.calculateHealthyTummiesScore(productData, 8);
        console.log('Score calculation completed:', scanResult ? 'Success' : 'Failed');
        
        toast({
          title: "Product Found!",
          description: `Analyzed ${productData.product_name || 'product'}`,
        });
      } else {
        console.log('Step 2: Product not found, generating mock data...');
        scanResult = ScanService.generateMockScanResult();
        
        toast({
          title: "Product Not Found",
          description: "Product not in database. Using sample data for demonstration.",
          variant: "destructive",
        });
      }
      
      console.log('Step 3: Recording scan...');
      await recordScan(scanResult, scannedCode);
      console.log('Scan recorded successfully');
      
      console.log('Step 4: Navigating to results...');
      navigate('/scan-result', { 
        state: { 
          scanResult,
          barcode: scannedCode 
        }
      });
      
    } catch (error) {
      console.error('=== Error in handleLoadingComplete:', error);
      
      // Provide specific error feedback
      let errorMessage = "Failed to analyze product. Please try again.";
      let errorTitle = "Processing Error";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
          errorTitle = "Connection Error";
        } else if (error.message.includes('API request failed')) {
          errorMessage = "Product database is temporarily unavailable. Please try again later.";
          errorTitle = "Service Unavailable";
        } else if (error.message.includes('fetch product data')) {
          errorMessage = "Unable to retrieve product information. Please try scanning again.";
          errorTitle = "Data Error";
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  const handleTestScan = async () => {
    console.log('Starting test scan');
    setIsLoading(true);
  };

  const handleTestLoadingComplete = async () => {
    const mockResult = ScanService.generateMockScanResult();
    
    await recordScan(mockResult);
    
    toast({
      title: MESSAGES.SCAN.TEST_COMPLETE,
      description: `${mockResult.product.productName} scored ${mockResult.healthyTummiesScore}/100`,
    });
    
    navigate('/scan-result', { 
      state: { scanResult: mockResult }
    });
  };

  const handleScanAgain = () => {
    console.log('Scanning again');
    setScannedCode('');
    setScanError('');
    handleStartCamera();
  };

  return {
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
  };
};
