
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
    setHasPermission(true);
    setScanError('');
  };

  const handlePermissionDenied = () => {
    setHasPermission(false);
    setIsCameraActive(false);
  };

  const handleStartCamera = () => {
    if (!hasPermission) {
      setScanError('Camera permission is required to scan barcodes');
      return;
    }
    
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
    setScanError('');
    
    toast({
      title: "Barcode Detected!",
      description: `Found barcode: ${code}`,
    });
  };

  const handleScanError = (error: any) => {
    console.log('Scan attempt:', error?.message || 'No barcode detected');
    
    if (error?.message && !error.message.includes('No MultiFormat Readers were able to detect the code')) {
      console.error('Camera error:', error);
      setScanError('Failed to access camera. Please check permissions and try again.');
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
    setScannedCode('');
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
