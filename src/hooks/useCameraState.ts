
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useCameraState = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState(false);

  const handlePermissionGranted = () => {
    console.log('Camera permission granted');
    setHasPermission(true);
    setScanError('');
    
    toast({
      title: "📹 Camera Ready!",
      description: "Ready to scan barcodes",
      duration: 1500,
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
        title: "⚠️ Permission Required",
        description: "Camera access needed to scan",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    console.log('Starting camera for scanning');
    setIsCameraActive(true);
    setScanError('');
  };

  const handleStopCamera = () => {
    console.log('Stopping camera');
    setIsCameraActive(false);
  };

  return {
    isCameraActive,
    scanError,
    hasPermission,
    setScanError,
    setIsCameraActive,
    setHasPermission,
    handlePermissionGranted,
    handlePermissionDenied,
    handleStartCamera,
    handleStopCamera,
  };
};
