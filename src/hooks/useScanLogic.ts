
import { useCameraState } from './useCameraState';
import { useScanProcessing } from './useScanProcessing';
import { useScanEvents } from './useScanEvents';

export const useScanLogic = () => {
  const {
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
  } = useCameraState();

  const {
    isLoading,
    scannedCode,
    setScannedCode,
    handleProcessScan,
    handleLoadingComplete,
    handleTestScan,
    handleTestLoadingComplete,
  } = useScanProcessing();

  const {
    handleScanSuccess,
    handleScanError,
    handleScanAgain,
  } = useScanEvents({
    setScannedCode,
    setIsCameraActive,
    setScanError,
    setHasPermission,
    handleStartCamera,
  });

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
