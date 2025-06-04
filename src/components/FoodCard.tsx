
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { FoodWithIntroduction } from '@/services/introducedFoodsService';

interface FoodCardProps {
  food: FoodWithIntroduction;
  bulkMode: boolean;
  isSelected: boolean;
  onClick: (food: FoodWithIntroduction) => void;
  onToggleIntroduced: (food: FoodWithIntroduction) => void;
}

export const FoodCard = ({ 
  food, 
  bulkMode, 
  isSelected, 
  onClick, 
  onToggleIntroduced 
}: FoodCardProps) => {
  return (
    <div
      onClick={() => onClick(food)}
      className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        bulkMode && isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {food.Image ? (
            <img 
              src={food.Image} 
              alt={food.name || 'Food'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <span className="text-lg">🍎</span>
          )}
          <span className="text-lg hidden">🍎</span>
        </div>
        <div className="flex items-center">
          {bulkMode ? (
            isSelected ? (
              <CheckCircle className="w-4 h-4 text-blue-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleIntroduced(food);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {food.introduced ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
        {food.name || 'Unknown Food'}
      </h3>
      
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {food.foodType && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {food.foodType}
          </span>
        )}
        {food.introduced && (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
            Introduced
          </span>
        )}
      </div>
      
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
        {food.ageSuggestion || food.introductionSummary || 'Tap to learn more about this food'}
      </p>
    </div>
  );
};
