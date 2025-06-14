
import React, { useEffect } from 'react';
import { Camera, AlertCircle, Settings, RefreshCw, Smartphone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCameraPermission } from '@/hooks/useCameraPermission';

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

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('safari') && userAgent.includes('mobile')) {
      return {
        browser: 'iOS Safari',
        steps: [
          'Tap the "AA" icon in the address bar',
          'Select "Website Settings"',
          'Tap "Camera" and choose "Allow"',
          'Refresh this page'
        ]
      };
    } else if (userAgent.includes('chrome') && userAgent.includes('mobile')) {
      return {
        browser: 'Chrome Mobile',
        steps: [
          'Tap the lock icon next to the URL',
          'Tap "Permissions"',
          'Enable "Camera"',
          'Refresh this page'
        ]
      };
    } else if (userAgent.includes('chrome')) {
      return {
        browser: 'Chrome Desktop',
        steps: [
          'Click the camera icon in the address bar',
          'Select "Always allow" or "Allow"',
          'Refresh if needed'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Click the camera icon in the address bar',
          'Choose "Allow" and check "Remember this decision"',
          'Refresh if needed'
        ]
      };
    }
    
    return {
      browser: 'Your Browser',
      steps: [
        'Look for a camera icon in your browser\'s address bar',
        'Click it and allow camera access',
        'You may need to refresh the page'
      ]
    };
  };

  // Show permission status badge if requested
  if (showPermissionStatus && permissionState === 'granted') {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Camera className="w-3 h-3 mr-1" />
            Camera Ready
          </Badge>
        </div>
        {children}
      </div>
    );
  }

  // Loading/checking state
  if (permissionState === 'checking') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-gray-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Checking Camera Access</h3>
          <p className="text-gray-600 text-sm">Please wait while we verify camera permissions...</p>
        </CardContent>
      </Card>
    );
  }

  // Camera not supported
  if (!isSupported || permissionState === 'unavailable') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Unavailable</h3>
          <p className="text-gray-600 text-sm mb-4">
            {error || 'Camera access is not supported on this device or browser.'}
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleRetryPermission}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            <p className="text-xs text-gray-500">
              Try using a different browser or device with camera support.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Permission granted
  if (permissionState === 'granted') {
    return <>{children}</>;
  }

  // Permission denied with detailed instructions
  if (permissionState === 'denied') {
    const instructions = getBrowserInstructions();
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Denied</h3>
            <p className="text-gray-600 text-sm">
              {error || 'Camera permissions are required to scan barcodes.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    Enable Camera in {instructions.browser}
                  </h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    {instructions.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-200 text-blue-900 text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleRequestPermission}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Camera className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleRetryPermission}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-1">Still having trouble?</p>
                  <ul className="space-y-1">
                    <li>• Make sure no other apps are using your camera</li>
                    <li>• Try refreshing the page completely</li>
                    <li>• Check if camera works in other websites</li>
                    <li>• Clear browser cache and cookies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Permission prompt (initial request)
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-pink-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Required</h3>
        <p className="text-gray-600 text-sm mb-6">
          We need access to your camera to scan product barcodes. Your camera feed stays private and secure on your device.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleRequestPermission}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Enable Camera Access
          </Button>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Smartphone className="w-4 h-4" />
            <span>Works on mobile and desktop browsers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
