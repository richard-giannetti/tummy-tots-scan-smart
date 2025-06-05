import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Clock, Users, Star, Check } from 'lucide-react';
import { RecipesService, Recipe } from '@/services/recipesService';
import { toast } from '@/hooks/use-toast';

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [tried, setTried] = useState(false);
  const [rating, setRating] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

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

  const handleTriedToggle = () => {
    setTried(!tried);
    toast({
      title: tried ? "Removed from tried recipes" : "Added to tried recipes",
      description: tried ? "Recipe unmarked as tried" : "Great! Keep track of your favorites",
    });
  };

  const handleRating = (newRating: number) => {
    setRating(newRating);
    const ratingLabels = {
      1: "Baby didn't like it",
      2: "Not a favorite", 
      3: "It was okay",
      4: "Baby enjoyed it",
      5: "Baby loved it!"
    };
    
    toast({
      title: "Recipe rated!",
      description: ratingLabels[newRating as keyof typeof ratingLabels],
    });
  };

  const toggleIngredientCheck = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
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

  const renderIngredients = (ingredients: any) => {
    if (!ingredients) return null;
    
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
    
    return ingredientArray.map((ingredient, index) => {
      const ingredientText = typeof ingredient === 'string' ? ingredient : 
        ingredient?.name || ingredient?.ingredient || JSON.stringify(ingredient);
      
      return (
        <div 
          key={index}
          className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
            checkedIngredients.has(index) 
              ? 'bg-green-50 border-green-200' 
              : 'bg-white border-gray-200 hover:border-pink-200'
          }`}
          onClick={() => toggleIngredientCheck(index)}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
            checkedIngredients.has(index)
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300'
          }`}>
            {checkedIngredients.has(index) && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={`flex-1 ${checkedIngredients.has(index) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {ingredientText}
          </span>
        </div>
      );
    });
  };

  const renderMethod = (method: any) => {
    if (!method) return null;
    
    // Handle Json type - could be array or string
    let methodArray: any[] = [];
    
    if (Array.isArray(method)) {
      methodArray = method;
    } else if (typeof method === 'string') {
      try {
        const parsed = JSON.parse(method);
        methodArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        methodArray = [method];
      }
    } else if (typeof method === 'object') {
      methodArray = [method];
    }
    
    return methodArray.map((step, index) => {
      const stepText = typeof step === 'string' ? step : 
        step?.instruction || step?.step || JSON.stringify(step);
      
      return (
        <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <p className="text-gray-800 leading-relaxed">{stepText}</p>
        </div>
      );
    });
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
            onClick={() => navigate('/recipes')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Back to recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img 
          src={recipe.link || '/placeholder.svg'} 
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {/* Recipe Info */}
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
                onClick={handleTriedToggle}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  tried 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                {tried ? '✓ Tried this recipe' : 'Mark as tried'}
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rate this recipe:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="transition-colors"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {recipe.ingredients && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
            <div className="space-y-2">
              {renderIngredients(recipe.ingredients)}
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.method && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
            <div className="space-y-4">
              {renderMethod(recipe.method)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
