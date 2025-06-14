
import React from 'react';
import { BookOpen } from 'lucide-react';
import { BabyProfile } from '@/services/babyProfileService';

interface TipHeaderProps {
  babyProfile: BabyProfile | null;
}

export const TipHeader = ({ babyProfile }: TipHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Tips for {babyProfile?.name || 'Your Baby'}
        </h2>
      </div>
    </div>
  );
};
