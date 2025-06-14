import React from 'react';
import { Camera, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { isIosSafari } from '@/utils/isIosSafari';

interface CameraPromptStateProps {
  onRequestPermission: () => void;
}

export const CameraPromptState: React.FC<CameraPromptStateProps> = ({
  onRequestPermission
}) => {
  const [showIosInfo, setShowIosInfo] = React.useState(false);

  React.useEffect(() => {
    // Only show this info if we're on iOS Safari, and not already dismissed
    if (isIosSafari() && !localStorage.getItem('iosCameraInfoShown')) {
      setShowIosInfo(true);
    }
  }, []);

  const handleDismissInfo = () => {
    setShowIosInfo(false);
    localStorage.setItem('iosCameraInfoShown', '1');
  };

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
        
        {/* iOS Safari Info */}
        {showIosInfo && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4 flex items-start text-left mx-auto max-w-sm shadow transition">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <span className="block text-yellow-800 text-sm font-medium mb-1">iOS Privacy Note</span>
              <span className="text-yellow-700 text-xs">
                On iPhone or iPad, you may be asked to grant camera permission every time you scan. 
                This is a privacy requirement by Apple and is not caused by this app.
              </span>
              <button
                onClick={handleDismissInfo}
                className="mt-2 text-xs text-yellow-700 underline hover:text-yellow-900 block"
                tabIndex={0}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={onRequestPermission}
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
