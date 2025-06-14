
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraUnavailableStateProps {
  error: string | null;
  onRetryPermission: () => void;
}

export const CameraUnavailableState: React.FC<CameraUnavailableStateProps> = ({
  error,
  onRetryPermission
}) => {
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
            onClick={onRetryPermission}
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
};
