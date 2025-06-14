
import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '@/services/recipesService';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();

  const formatIngredients = (ingredients: any): string => {
    if (!ingredients) return '';
    
    // Handle Json type - could be array or string
    let ingredientArray: any[] = [];
    
    if (Array.isArray(ingredients)) {
      ingredientArray = ingredients;
    } else if (typeof ingredients === 'string') {
      try {
        const parsed = JSON.parse(ingredients);
        ingredientArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        ingredientArray = [ingredients];
      }
    } else if (typeof ingredients === 'object') {
      ingredientArray = [ingredients];
    }
    
    return ingredientArray.slice(0, 2).map(ing => 
      typeof ing === 'string' ? ing : ing?.name || ing?.ingredient || 'Ingredient'
    ).join(', ') + (ingredientArray.length > 2 ? '...' : '');
  };

  const getRecipeImage = (): string => {
    // Use the recipe's link field as image URL, fallback to placeholder
    return recipe.link && recipe.link !== '' ? recipe.link : '/placeholder.svg';
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/recipes/${recipe._id}`)}
    >
      <div className="relative">
        <div className="w-full h-32 bg-gray-100 overflow-hidden">
          <img 
            src={getRecipeImage()} 
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="absolute top-2 right-2">
          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Star className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">
          {recipe.title}
        </h3>
        
        {recipe.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{recipe.time || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{recipe.servings || 1}</span>
          </div>
        </div>
        
        {recipe.ingredients && (
          <p className="text-xs text-gray-500 line-clamp-1">
            {formatIngredients(recipe.ingredients)}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button className="text-xs text-pink-600 font-medium hover:text-pink-700 transition-colors">
            Mark as Tried
          </button>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
