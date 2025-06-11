
import React from 'react';
import { BabyProfile } from '@/services/babyProfileService';
import { BabyProfileCard } from './BabyProfileCard';
import { ScanButton } from './ScanButton';
import { RecentScans } from './RecentScans';
import { RecipeRecommendations } from './RecipeRecommendations';
import { FoodFacts } from './FoodFacts';
import { FeedingJourneyProgress } from './FeedingJourneyProgress';
import { NutritionTipCard } from './NutritionTipCard';

interface Progress {
  feeding_level: number;
  total_points: number;
  level_progress: number;
  current_streak: number;
}

interface HomepageMainContentProps {
  hasProfile: boolean;
  babyProfile: BabyProfile | null;
  progress: Progress | null;
  onProfileComplete: (profileData: BabyProfile | Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => void;
}

export const HomepageMainContent = ({
  hasProfile,
  babyProfile,
  progress,
  onProfileComplete
}: HomepageMainContentProps) => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      {/* Baby Profile Section */}
      <BabyProfileCard
        hasProfile={hasProfile}
        babyProfile={babyProfile}
        onProfileComplete={onProfileComplete}
      />

      {/* Scan Button Section */}
      <ScanButton babyName={babyProfile?.name} />

      {/* Food Facts Section */}
      <FoodFacts babyName={babyProfile?.name} />

      {/* Recent Scans Section */}
      <RecentScans />

      {/* Recipe Recommendations Section */}
      <RecipeRecommendations babyName={babyProfile?.name} />

      {/* Nutrition Tip Card - placed before Feeding Journey */}
      <NutritionTipCard babyProfile={babyProfile} />

      {/* Gamification Progress */}
      {progress && (
        <FeedingJourneyProgress
          currentLevel={progress.feeding_level}
          totalPoints={progress.total_points}
          levelProgress={progress.level_progress}
          currentStreak={progress.current_streak}
        />
      )}
    </div>
  );
};
