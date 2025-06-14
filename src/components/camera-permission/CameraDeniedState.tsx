
import React from 'react';
import { AlertCircle, Settings, Camera, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBrowserInstructions } from '@/utils/browserInstructions';

interface CameraDeniedStateProps {
  error: string | null;
  onRequestPermission: () => void;
  onRetryPermission: () => void;
}

export const CameraDeniedState: React.FC<CameraDeniedStateProps> = ({
  error,
  onRequestPermission,
  onRetryPermission
}) => {
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
              onClick={onRequestPermission}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Camera className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onRetryPermission}
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
};
