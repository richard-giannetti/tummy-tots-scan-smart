
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BabyProfile } from '@/services/babyProfileService';
import { useNutritionTips } from '@/hooks/useNutritionTips';
import { TipLoadingState } from './nutrition-tips/TipLoadingState';
import { TipEmptyState } from './nutrition-tips/TipEmptyState';
import { TipHeader } from './nutrition-tips/TipHeader';
import { TipContent } from './nutrition-tips/TipContent';

interface NutritionTipCardProps {
  babyProfile: BabyProfile | null;
  className?: string;
}

export const NutritionTipCard = ({ babyProfile, className = '' }: NutritionTipCardProps) => {
  const { currentTip, isLoading, availableTips, markAsRead, getNewTip, user } = useNutritionTips();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMarkAsRead = () => {
    markAsRead();
    setIsExpanded(false);
  };

  const handleGetNewTip = () => {
    getNewTip();
    setIsExpanded(false);
  };

  if (isLoading) {
    return <TipLoadingState babyProfile={babyProfile} className={className} />;
  }

  if (!currentTip) {
    return (
      <TipEmptyState 
        babyProfile={babyProfile} 
        availableTipsCount={availableTips.length}
        userId={user?.id}
        className={className} 
      />
    );
  }

  return (
    <div className={className}>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-md">
        <CardContent className="p-0">
          <TipHeader babyProfile={babyProfile} />
          <TipContent
            currentTip={currentTip}
            isExpanded={isExpanded}
            availableTipsCount={availableTips.length}
            onToggleExpanded={() => setIsExpanded(!isExpanded)}
            onMarkAsRead={handleMarkAsRead}
            onGetNewTip={handleGetNewTip}
          />
        </CardContent>
      </Card>
    </div>
  );
};
