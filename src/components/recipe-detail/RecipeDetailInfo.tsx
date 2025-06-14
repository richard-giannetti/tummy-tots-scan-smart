
import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Recipe } from '@/services/recipesService';

interface RecipeDetailInfoProps {
  recipe: Recipe;
  tried: boolean;
  updatingTried: boolean;
  onTriedToggle: () => void;
}

export const RecipeDetailInfo = ({
  recipe,
  tried,
  updatingTried,
  onTriedToggle,
}: RecipeDetailInfoProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
      <p className="text-gray-600 mb-4">{recipe.description}</p>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{recipe.time || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{recipe.servings || 1} serving{(recipe.servings || 1) > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* User Interactions */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={onTriedToggle}
            disabled={updatingTried}
            className={`px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
              tried 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            }`}
          >
            {updatingTried ? '...' : (tried ? '✓ Tried this recipe' : 'Mark as tried')}
          </button>
        </div>
      </div>
    </div>
  );
};
