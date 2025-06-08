
import React from 'react';
import { Baby, Info } from 'lucide-react';

interface ProfileFormHeaderProps {
  hasProfile: boolean;
}

export const ProfileFormHeader = ({ hasProfile }: ProfileFormHeaderProps) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <Baby className="w-6 h-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">
          {hasProfile ? 'Edit Baby Profile' : 'Set Up Baby Profile'}
        </h2>
      </div>

      {/* Scientific research note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Enhanced Healthy Tummies Score</p>
            <p>We now use advanced algorithms based on WHO/AAP guidelines to provide personalized nutrition scores. The more information you provide, the more accurate our recommendations become.</p>
          </div>
        </div>
      </div>
    </>
  );
};
