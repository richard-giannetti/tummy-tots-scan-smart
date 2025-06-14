
import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BabyProfile } from '@/services/babyProfileService';

interface TipEmptyStateProps {
  babyProfile: BabyProfile | null;
  availableTipsCount: number;
  userId?: string;
  className?: string;
}

export const TipEmptyState = ({ 
  babyProfile, 
  availableTipsCount, 
  userId, 
  className = '' 
}: TipEmptyStateProps) => {
  return (
    <div className={className}>
      <Card className="p-6">
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
        <div className="text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">No Tips Available</h3>
              <p className="text-sm text-gray-600">
                No nutrition tips found in the database. Please check back later!
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Debug: {availableTipsCount} tips in database
              </p>
              <p className="text-xs text-gray-500">
                User: {userId ? 'Authenticated' : 'Not authenticated'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
