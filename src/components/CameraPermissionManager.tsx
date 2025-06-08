import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, Settings } from 'lucide-react';

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
  const [permissionState, setPermissionState] = useState<'checking' | 'granted' | 'denied' | 'prompt'>('checking');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      // First check if permissions API is available
      if ('permissions' in navigator) {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        setPermissionState(permissionStatus.state);
        
        if (permissionStatus.state === 'granted') {
          onPermissionGranted();
        } else if (permissionStatus.state === 'denied') {
          onPermissionDenied();
        }
        
        // Listen for permission changes
        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state);
          if (permissionStatus.state === 'granted') {
            onPermissionGranted();
          } else if (permissionStatus.state === 'denied') {
            onPermissionDenied();
          }
        };
      } else {
        // Fallback: try to access camera directly
        setPermissionState('prompt');
      }
    } catch (error) {
      console.log('Permission API not supported or error:', error);
      // Fallback to prompt state
      setPermissionState('prompt');
    }
  };

  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera for barcode scanning
        } 
      });
      
      // Stop the stream immediately as we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState('granted');
      onPermissionGranted();
    } catch (error: any) {
      console.error('Camera permission denied:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        onPermissionDenied();
      } else {
        // Other errors (NotFoundError, etc.)
        setPermissionState('denied');
        onPermissionDenied();
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  if (permissionState === 'checking') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-gray-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Checking Camera Access</h3>
        <p className="text-gray-600 text-sm">Please wait...</p>
      </div>
    );
  }

  if (permissionState === 'granted') {
    return <>{children}</>;
  }

  if (permissionState === 'denied') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Denied</h3>
        <p className="text-gray-600 text-sm mb-4">
          To scan barcodes, please enable camera access in your browser settings.
        </p>
        <div className="space-y-3">
          <button
            onClick={requestCameraPermission}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            Try Again
          </button>
          <div className="text-xs text-gray-500 space-y-1">
            <p>If this doesn't work:</p>
            <p>• Look for a camera icon in your browser's address bar</p>
            <p>• Go to browser settings and allow camera access</p>
            <p>• Refresh the page after changing settings</p>
          </div>
        </div>
      </div>
    );
  }

  // permissionState === 'prompt'
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center mb-4">
        <Camera className="w-8 h-8 text-pink-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Required</h3>
      <p className="text-gray-600 text-sm mb-4">
        We need access to your camera to scan barcodes. Your camera feed stays on your device.
      </p>
      <button
        onClick={requestCameraPermission}
        disabled={isRequestingPermission}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50"
      >
        {isRequestingPermission ? 'Requesting Access...' : 'Enable Camera'}
      </button>
    </div>
  );
};
