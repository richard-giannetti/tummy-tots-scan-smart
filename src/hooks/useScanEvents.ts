
import { toast } from '@/hooks/use-toast';

interface UseScanEventsProps {
  setScannedCode: (code: string) => void;
  setIsCameraActive: (active: boolean) => void;
  setScanError: (error: string) => void;
  setHasPermission: (permission: boolean) => void;
  handleStartCamera: () => void;
}

export const useScanEvents = ({
  setScannedCode,
  setIsCameraActive,
  setScanError,
  setHasPermission,
  handleStartCamera,
}: UseScanEventsProps) => {
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
      title: "✅ Barcode Found!",
      description: `Code: ${code.slice(0, 12)}...`,
      duration: 2000,
    });
  };

  const handleScanError = (error: any) => {
    console.log('Scan error:', error);
    
    // Only show user-facing errors for significant issues
    if (error?.message && 
        !error.message.includes('No MultiFormat Readers') && 
        !error.message.includes('No barcode detected')) {
      
      console.error('Significant camera error:', error);
      
      let errorMessage = 'Camera error occurred';
      let errorTitle = '❌ Scanning Issue';
      
      if (error.message.includes('not readable') || error.message.includes('in use')) {
        errorMessage = 'Camera busy or in use';
        errorTitle = '📷 Camera Busy';
      } else if (error.message.includes('permission') || error.message.includes('denied')) {
        errorMessage = 'Camera permission revoked';
        errorTitle = '🚫 Permission Lost';
        setHasPermission(false);
      }
      
      setScanError(errorMessage);
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleScanAgain = () => {
    console.log('Scanning again');
    setScannedCode('');
    setScanError('');
    handleStartCamera();
  };

  return {
    handleScanSuccess,
    handleScanError,
    handleScanAgain,
  };
};
