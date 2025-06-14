
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
      console.log('Processing barcode:', scannedCode);
      
      const productData = await ScanService.getProductByBarcode(scannedCode);
      
      let scanResult;
      if (productData) {
        scanResult = ScanService.calculateHealthyTummiesScore(productData, 8);
        console.log('Real product found and analyzed:', scanResult);
        
        toast({
          title: "Product Found!",
          description: `Analyzed ${productData.productName}`,
        });
      } else {
        scanResult = ScanService.generateMockScanResult();
        console.log('Product not found, using mock data:', scanResult);
        
        toast({
          title: "Product Not Found",
          description: "Using sample data for demonstration",
        });
      }
      
      await recordScan(scanResult, scannedCode);
      
      navigate('/scan-result', { 
        state: { 
          scanResult,
          barcode: scannedCode 
        }
      });
    } catch (error) {
      console.error('Error processing scan:', error);
      toast({
        title: "Processing Error",
        description: "Failed to analyze product. Please try again.",
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
