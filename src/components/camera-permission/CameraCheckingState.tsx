
import React from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const CameraCheckingState: React.FC = () => {
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
};
