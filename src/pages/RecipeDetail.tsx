
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipesService, Recipe } from '@/services/recipes';
import { toast } from '@/hooks/use-toast';
import { RecipeDetailHeader } from '@/components/recipe-detail/RecipeDetailHeader';
import { RecipeDetailInfo } from '@/components/recipe-detail/RecipeDetailInfo';
import { RecipeIngredients } from '@/components/recipe-detail/RecipeIngredients';
import { RecipeInstructions } from '@/components/recipe-detail/RecipeInstructions';

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [tried, setTried] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [updatingTried, setUpdatingTried] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const result = await RecipesService.getRecipeById(recipeId);
      
      if (result.success && result.recipe) {
        setRecipe(result.recipe);
        await loadRecipeInteraction(recipeId);
        await loadFavoriteStatus(recipeId);
      } else {
        toast({
          title: "Error",
          description: "Recipe not found",
          variant: "destructive",
        });
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: "Error",
        description: "Failed to load recipe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecipeInteraction = async (recipeId: string) => {
    try {
      const interaction = await RecipesService.getRecipeInteraction(recipeId);
      if (interaction.success && interaction.interaction) {
        setTried(interaction.interaction.tried);
      }
    } catch (error) {
      console.error('Error loading recipe interaction:', error);
    }
  };

  const loadFavoriteStatus = async (recipeId: string) => {
    try {
      const result = await RecipesService.isRecipeFavorited(recipeId);
      if (result.success) {
        setIsFavorited(result.isFavorited || false);
      }
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  const handleTriedToggle = async () => {
    if (!recipe) return;
    
    try {
      setUpdatingTried(true);
      const newTriedStatus = !tried;
      
      const result = await RecipesService.updateRecipeInteraction(
        recipe._id, 
        newTriedStatus
      );
      
      if (result.success) {
        setTried(newTriedStatus);
        toast({
          title: newTriedStatus ? "Added to tried recipes" : "Removed from tried recipes",
          description: newTriedStatus ? "Great! Keep track of your favorites" : "Recipe unmarked as tried",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update recipe status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating recipe interaction:', error);
      toast({
        title: "Error",
        description: "Failed to update recipe status",
        variant: "destructive",
      });
    } finally {
      setUpdatingTried(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!recipe) return;
    
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

  const handleShare = () => {
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Recipe link copied to clipboard",
      });
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recipe not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <RecipeDetailHeader
        recipe={recipe}
        isFavorited={isFavorited}
        isTogglingFavorite={isTogglingFavorite}
        onBackClick={handleBackClick}
        onShare={handleShare}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        <RecipeDetailInfo
          recipe={recipe}
          tried={tried}
          updatingTried={updatingTried}
          onTriedToggle={handleTriedToggle}
        />

        <RecipeIngredients ingredients={recipe.ingredients} />

        <RecipeInstructions method={recipe.method} />
      </div>
    </div>
  );
};

export default RecipeDetail;
