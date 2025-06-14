
import React from 'react';
import { Camera, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraPromptStateProps {
  onRequestPermission: () => void;
}

export const CameraPromptState: React.FC<CameraPromptStateProps> = ({
  onRequestPermission
}) => {
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
