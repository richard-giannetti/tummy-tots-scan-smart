
import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Eye } from 'lucide-react';
import { RecipesService, Recipe } from '@/services/recipesService';
import { useNavigate } from 'react-router-dom';

interface RecipeRecommendationsProps {
  babyName?: string;
}

export const RecipeRecommendations = ({ babyName }: RecipeRecommendationsProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [triedCount, setTriedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedRecipes();
  }, []);

  const fetchRecommendedRecipes = async () => {
    try {
      setLoading(true);
      const result = await RecipesService.getRecipes(1, 4);
      
      if (result.success && result.recipes) {
        setRecipes(result.recipes);
        // Set tried count to 0 initially
        setTriedCount(0);
      }
    } catch (error) {
      console.error('Error fetching recommended recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllRecipes = () => {
    navigate('/recipes');
  };

  const getRecipeImage = (recipe: Recipe): string => {
    return recipe.link || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
          Recipes for {babyName || 'Baby'}
        </h3>
        <button 
          onClick={handleViewAllRecipes}
          className="text-sm text-pink-500 hover:text-pink-600 font-medium"
        >
          View All Recipes
        </button>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">📚 Progress:</span> You've tried {triedCount} of 180+ recipes
        </p>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition-all cursor-pointer group"
            onClick={() => navigate(`/recipe/${recipe._id}`)}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={getRecipeImage(recipe)} 
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h4 className="font-medium text-gray-800 text-sm mb-1 truncate leading-tight">{recipe.title}</h4>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{recipe.time || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{recipe.servings || 1} serving{(recipe.servings || 1) > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Eye className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Tip:</span> All recipes are tailored for baby-led weaning and adjust as your baby grows!
        </p>
      </div>
    </div>
  );
};
