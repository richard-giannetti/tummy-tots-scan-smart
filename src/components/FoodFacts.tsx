import React from 'react';
import { Book, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIntroducedFoodsByType } from '@/hooks/useIntroducedFoodsByType';
import { Progress } from '@/components/ui/progress';

interface FoodFactsProps {
  babyName?: string;
}

export const FoodFacts = ({ babyName }: FoodFactsProps) => {
  const navigate = useNavigate();
  const { progressByType, totalIntroduced, loading } = useIntroducedFoodsByType();

  const handleExploreClick = () => {
    navigate('/food-facts');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Book className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
          <span className="truncate">Food Facts for {babyName || 'Baby'}</span>
        </h3>
        <button
          onClick={handleExploreClick}
          className="text-sm text-pink-500 hover:text-pink-600 font-medium whitespace-nowrap ml-2"
        >
          View All
        </button>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">📊 Progress:</span> You've introduced {loading ? '...' : totalIntroduced} foods
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {progressByType.slice(0, 3).map((item) => (
            <div key={item.foodType} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.foodType || 'Other'}
                </span>
                <span className="text-xs text-gray-500">
                  {item.introduced} / {item.total}
                </span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
              />
            </div>
          ))}
          {progressByType.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No food progress to display yet</p>
              <p className="text-xs text-gray-400 mt-1">Start by marking some foods as introduced!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
