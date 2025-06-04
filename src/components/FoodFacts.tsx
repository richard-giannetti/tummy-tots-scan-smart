
import React from 'react';
import { ChefHat, Book, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FoodFactsProps {
  babyName?: string;
}

export const FoodFacts = ({ babyName }: FoodFactsProps) => {
  const navigate = useNavigate();

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

      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Learn about foods</span> before introducing them to {babyName || 'your baby'}
        </p>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Age-appropriate recommendations
        </div>
        <div className="flex items-center text-xs text-gray-600 mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Safety and allergy information
        </div>
      </div>
    </div>
  );
};
