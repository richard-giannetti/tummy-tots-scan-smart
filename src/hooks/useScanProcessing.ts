
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useScanTracking } from '@/hooks/useScanTracking';
import { ScanService } from '@/services/scanService';

export const useScanProcessing = () => {
  const navigate = useNavigate();
  const { recordScan } = useScanTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>('');

  const handleProcessScan = async () => {
    if (!scannedCode) {
      toast({
        title: "❗ No Barcode",
        description: "Please scan a barcode first",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    console.log('Processing scanned barcode:', scannedCode);
    setIsLoading(true);
  };

  const handleLoadingComplete = async () => {
    try {
      console.log('=== Starting product analysis for barcode:', scannedCode);
      
      console.log('Step 1: Fetching product data...');
      const productData = await ScanService.getProductByBarcode(scannedCode);
      console.log('Product data received:', productData ? 'Success' : 'No data');
      
      let scanResult;
      if (productData) {
        console.log('Step 2: Calculating Healthy Tummies Score...');
        scanResult = await ScanService.calculateHealthyTummiesScore(productData, 8);
        console.log('Score calculation completed:', scanResult ? 'Success' : 'Failed');
        
        toast({
          title: "🎉 Product Found!",
          description: `Analyzed ${productData.product_name || 'product'}`,
          duration: 2000,
        });
      } else {
        console.log('Step 2: Product not found, generating mock data...');
        scanResult = ScanService.generateMockScanResult();
        
        toast({
          title: "⚠️ Product Not Found",
          description: "Using demo data",
          variant: "destructive",
          duration: 2500,
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
      
      let errorMessage = "Failed to analyze product";
      let errorTitle = "❌ Processing Error";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = "Check internet connection";
          errorTitle = "🌐 Connection Error";
        } else if (error.message.includes('API request failed')) {
          errorMessage = "Service temporarily unavailable";
          errorTitle = "🚫 Service Error";
        } else if (error.message.includes('fetch product data')) {
          errorMessage = "Unable to retrieve product info";
          errorTitle = "📦 Data Error";
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
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
      title: "🧪 Test Complete",
      description: `${mockResult.product.productName} scored ${mockResult.healthyTummiesScore}/100`,
      duration: 2000,
    });
    
    navigate('/scan-result', { 
      state: { scanResult: mockResult }
    });
  };

  return {
    isLoading,
    scannedCode,
    setScannedCode,
    handleProcessScan,
    handleLoadingComplete,
    handleTestScan,
    handleTestLoadingComplete,
  };
};
