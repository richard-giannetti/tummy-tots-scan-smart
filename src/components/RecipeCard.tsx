
import React, { useState, useEffect } from 'react';
import { Clock, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe, RecipesService } from '@/services/recipes';
import { toast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [recipe._id]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await RecipesService.isRecipeFavorited(recipe._id);
      if (result.success) {
        setIsFavorited(result.isFavorited || false);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking favorite button
    
    try {
      setIsTogglingFavorite(true);
      const result = await RecipesService.toggleRecipeFavorite(recipe._id);
      
      if (result.success) {
        const newFavoriteStatus = !isFavorited;
        setIsFavorited(newFavoriteStatus);
        
        toast({
          title: newFavoriteStatus ? "Added to favorites!" : "Removed from favorites",
          description: newFavoriteStatus ? "Recipe saved to your favorites" : "Recipe removed from favorites",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update favorite status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

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
          <button 
            onClick={handleFavoriteToggle}
            disabled={isTogglingFavorite}
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
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
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button className="text-xs text-pink-600 font-medium hover:text-pink-700 transition-colors">
            Mark as Tried
          </button>
        </div>
      </div>
    </div>
  );
};
