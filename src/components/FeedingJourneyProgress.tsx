
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';

interface FeedingJourneyProgressProps {
  currentLevel: string;
  totalPoints: number;
  levelProgress: number;
  currentStreak: number;
  className?: string;
}

export const FeedingJourneyProgress = ({
  currentLevel,
  totalPoints,
  levelProgress,
  currentStreak,
  className = ''
}: FeedingJourneyProgressProps) => {
  const getFeedingLevels = () => [
    { name: 'Curious Parent', minPoints: 0, maxPoints: 199 },
    { name: 'Informed Feeder', minPoints: 200, maxPoints: 499 },
    { name: 'Nutrition Navigator', minPoints: 500, maxPoints: 999 },
    { name: 'Feeding Expert', minPoints: 1000, maxPoints: 1999 },
    { name: 'Baby Food Master', minPoints: 2000, maxPoints: Infinity }
  ];

  const levels = getFeedingLevels();
  const currentLevelIndex = levels.findIndex(level => level.name === currentLevel);
  const nextLevel = levels[currentLevelIndex + 1];

  const getProgressColor = () => {
    const colors = [
      'bg-gradient-to-r from-pink-300 to-pink-400',
      'bg-gradient-to-r from-orange-300 to-orange-400', 
      'bg-gradient-to-r from-green-300 to-green-400',
      'bg-gradient-to-r from-blue-300 to-blue-400',
      'bg-gradient-to-r from-purple-300 to-purple-400'
    ];
    return colors[currentLevelIndex] || colors[0];
  };

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Feeding Journey</h3>
            <p className="text-sm text-gray-600">Your parenting progress</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{totalPoints}</div>
          <div className="text-xs text-gray-500">Nourish Points</div>
        </div>
      </div>

      {/* Current Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
            {currentLevel}
          </Badge>
          {nextLevel && (
            <span className="text-xs text-gray-500">
              Next: {nextLevel.name}
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <Progress value={levelProgress} className="h-3 bg-gray-100" />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{levelProgress}% to next level</span>
          {nextLevel && nextLevel.maxPoints !== Infinity && (
            <span>{nextLevel.minPoints - totalPoints} points needed</span>
          )}
        </div>
      </div>

      {/* Encouraging Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-semibold">🌱 Keep growing!</span> Your confidence as a parent is developing beautifully.
        </p>
      </div>
    </div>
  );
};
