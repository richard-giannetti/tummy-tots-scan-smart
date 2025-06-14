
import React, { memo } from 'react';
import { Clock, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe, RecipesService } from '@/services/recipes';
import { toast } from '@/hooks/use-toast';
import { useRecipeInteraction, useRecipeFavoriteStatus } from '@/hooks/useRecipes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = memo(({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use React Query for status checks
  const { data: favoriteData } = useRecipeFavoriteStatus(recipe._id);
  const { data: interactionData } = useRecipeInteraction(recipe._id);

  const isFavorited = favoriteData?.isFavorited || false;
  const isTried = interactionData?.interaction?.tried || false;

  // Mutations for optimistic updates
  const favoriteMutation = useMutation({
    mutationFn: () => RecipesService.toggleRecipeFavorite(recipe._id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['recipe-favorite', recipe._id] });
      const previousData = queryClient.getQueryData(['recipe-favorite', recipe._id]);
      queryClient.setQueryData(['recipe-favorite', recipe._id], {
        success: true,
        isFavorited: !isFavorited
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(['recipe-favorite', recipe._id], context.previousData);
      }
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        const newFavoriteStatus = !isFavorited;
        toast({
          title: newFavoriteStatus ? "Added to favorites!" : "Removed from favorites",
          description: newFavoriteStatus ? "Recipe saved to your favorites" : "Recipe removed from favorites",
        });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
      }
    },
  });

  const triedMutation = useMutation({
    mutationFn: (newTriedStatus: boolean) => 
      RecipesService.updateRecipeInteraction(recipe._id, newTriedStatus),
    onMutate: async (newTriedStatus) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['recipe-interaction', recipe._id] });
      const previousData = queryClient.getQueryData(['recipe-interaction', recipe._id]);
      queryClient.setQueryData(['recipe-interaction', recipe._id], {
        success: true,
        interaction: { tried: newTriedStatus }
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(['recipe-interaction', recipe._id], context.previousData);
      }
      toast({
        title: "Error",
        description: "Failed to update tried status",
        variant: "destructive",
      });
    },
    onSuccess: (result, newTriedStatus) => {
      if (result.success) {
        toast({
          title: newTriedStatus ? "Marked as tried!" : "Unmarked as tried",
          description: newTriedStatus ? "Great! Keep track of your tried recipes" : "Recipe unmarked as tried",
        });
      }
    },
  });

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  const handleTriedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triedMutation.mutate(!isTried);
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
            disabled={favoriteMutation.isPending}
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
          <button 
            onClick={handleTriedToggle}
            disabled={triedMutation.isPending}
            className={`text-xs font-medium transition-colors ${
              isTried 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            {triedMutation.isPending ? '...' : (isTried ? '✓ Tried' : 'Mark as Tried')}
          </button>
        </div>
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';
