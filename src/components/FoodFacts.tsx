
import React from 'react';
import { ChefHat, Book, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIntroducedFoodsCount } from '@/hooks/useIntroducedFoodsCount';

interface FoodFactsProps {
  babyName?: string;
}

export const FoodFacts = ({ babyName }: FoodFactsProps) => {
  const navigate = useNavigate();
  const { count: introducedCount, loading } = useIntroducedFoodsCount();

  const handleExploreClick = () => {
    navigate('/food-facts');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Food Facts</h3>
            <p className="text-sm text-gray-600">
              {babyName ? `Track ${babyName}'s food journey` : 'Discover and track foods'}
            </p>
          </div>
        </div>
        <button
          onClick={handleExploreClick}
          className="flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          Explore
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Foods Introduced
            </span>
          </div>
          <div className="text-right">
            {loading ? (
              <div className="w-8 h-6 bg-green-200 rounded animate-pulse"></div>
            ) : (
              <span className="text-2xl font-bold text-green-600">{introducedCount}</span>
            )}
            <p className="text-xs text-green-600 mt-1">
              {babyName ? `${babyName}'s progress` : 'Your progress'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <ChefHat className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-800">Browse Foods</p>
          <p className="text-xs text-green-600">Discover safe foods for your baby</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <Book className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-blue-800">Track Progress</p>
          <p className="text-xs text-blue-600">Mark foods as introduced</p>
        </div>
      </div>
    </div>
  );
};
