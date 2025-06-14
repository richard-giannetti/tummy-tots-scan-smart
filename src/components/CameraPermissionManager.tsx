
import React from 'react';
import { EnhancedCameraPermissionManager } from './EnhancedCameraPermissionManager';

interface CameraPermissionManagerProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  children: React.ReactNode;
}

export const CameraPermissionManager: React.FC<CameraPermissionManagerProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  children
}) => {
  return (
    <EnhancedCameraPermissionManager
      onPermissionGranted={onPermissionGranted}
      onPermissionDenied={onPermissionDenied}
    >
      {children}
    </EnhancedCameraPermissionManager>
  );
};
