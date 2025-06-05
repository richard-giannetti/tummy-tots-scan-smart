
import React from 'react';
import { Book, ArrowRight, CheckCircle } from 'lucide-react';
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
          <span className="font-semibold">📊 Progress:</span> You've introduced {loading ? '...' : introducedCount} foods
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <Book className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-800">Browse Foods</p>
          <p className="text-xs text-green-600">Discover safe foods for your baby</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-blue-800">Track Progress</p>
          <p className="text-xs text-blue-600">Mark foods as introduced</p>
        </div>
      </div>
    </div>
  );
};
