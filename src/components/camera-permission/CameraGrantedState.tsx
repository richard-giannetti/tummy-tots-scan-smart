
import React from 'react';
import { Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CameraGrantedStateProps {
  showPermissionStatus: boolean;
  children: React.ReactNode;
}

export const CameraGrantedState: React.FC<CameraGrantedStateProps> = ({
  showPermissionStatus,
  children
}) => {
  if (showPermissionStatus) {
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

  return <>{children}</>;
};
