
import React, { useEffect } from 'react';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { CameraCheckingState } from './camera-permission/CameraCheckingState';
import { CameraUnavailableState } from './camera-permission/CameraUnavailableState';
import { CameraDeniedState } from './camera-permission/CameraDeniedState';
import { CameraPromptState } from './camera-permission/CameraPromptState';
import { CameraGrantedState } from './camera-permission/CameraGrantedState';

interface EnhancedCameraPermissionManagerProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  children: React.ReactNode;
  showPermissionStatus?: boolean;
}

export const EnhancedCameraPermissionManager: React.FC<EnhancedCameraPermissionManagerProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  children,
  showPermissionStatus = false
}) => {
  const {
    permissionState,
    isSupported,
    requestPermission,
    checkPermission,
    clearPermissionCache,
    error
  } = useCameraPermission();

  useEffect(() => {
    if (permissionState === 'granted') {
      onPermissionGranted();
    } else if (permissionState === 'denied' || permissionState === 'unavailable') {
      onPermissionDenied();
    }
  }, [permissionState, onPermissionGranted, onPermissionDenied]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      // Additional fallback: try to re-check permission state
      setTimeout(() => checkPermission(), 1000);
    }
  };

  const handleRetryPermission = async () => {
    clearPermissionCache();
    await checkPermission();
  };

  // Loading/checking state
  if (permissionState === 'checking') {
    return <CameraCheckingState />;
  }

  // Camera not supported
  if (!isSupported || permissionState === 'unavailable') {
    return (
      <CameraUnavailableState
        error={error}
        onRetryPermission={handleRetryPermission}
      />
    );
  }

  // Permission granted
  if (permissionState === 'granted') {
    return (
      <CameraGrantedState showPermissionStatus={showPermissionStatus}>
        {children}
      </CameraGrantedState>
    );
  }

  // Permission denied with detailed instructions
  if (permissionState === 'denied') {
    return (
      <CameraDeniedState
        error={error}
        onRequestPermission={handleRequestPermission}
        onRetryPermission={handleRetryPermission}
      />
    );
  }

  // Permission prompt (initial request)
  return <CameraPromptState onRequestPermission={handleRequestPermission} />;
};
