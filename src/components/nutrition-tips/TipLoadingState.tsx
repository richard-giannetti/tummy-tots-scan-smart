
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BabyProfile } from '@/services/babyProfileService';

interface TipLoadingStateProps {
  babyProfile: BabyProfile | null;
  className?: string;
}

export const TipLoadingState = ({ babyProfile, className = '' }: TipLoadingStateProps) => {
  return (
    <div className={className}>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Tips for {babyProfile?.name || 'Your Baby'}
            </h2>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    </div>
  );
};
