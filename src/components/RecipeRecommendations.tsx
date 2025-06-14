import React, { useState, useEffect } from 'react';
import { ChefHat, Eye, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipesService, Recipe } from '@/services/recipesService';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { toast } from '@/hooks/use-toast';
interface RecipeRecommendationsProps {
  babyName?: string;
}
export const RecipeRecommendations = ({
  babyName
}: RecipeRecommendationsProps) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [triedRecipesCount, setTriedRecipesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const fetchTriedRecipesCount = async () => {
    console.log('Fetching tried recipes count...');
    const triedCountResult = await RecipesService.getTriedRecipesCount();
    if (triedCountResult.success && triedCountResult.count !== undefined) {
      console.log('Tried recipes count fetched:', triedCountResult.count);
      setTriedRecipesCount(triedCountResult.count);
    } else {
      console.error('Failed to fetch tried recipes count:', triedCountResult.error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First get the baby profile
        const profileResult = await BabyProfileService.getBabyProfile();
        if (profileResult.success && profileResult.profile) {
          setBabyProfile(profileResult.profile);
        }

        // Fetch recipes
        const recipesResult = await RecipesService.getRecipes(1, 3);
        if (recipesResult.success && recipesResult.recipes) {
          setRecipes(recipesResult.recipes);
        }

        // Fetch tried recipes count
        await fetchTriedRecipesCount();
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load recipe recommendations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add an interval to periodically check for updates to the tried recipes count
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTriedRecipesCount();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for focus events to refresh count when user returns to the tab
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing tried recipes count');
      fetchTriedRecipesCount();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipes/${recipe._id}`, {
      state: {
        recipe
      }
    });
  };
  const handleViewAll = () => {
    navigate('/recipes');
  };
  const getRecipeImage = (recipe: Recipe): string => {
    // Use the recipe's link field as image URL, fallback to placeholder
    return recipe.link && recipe.link !== '' ? recipe.link : '/placeholder.svg';
  };
  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
            Recipes for {babyName || 'Baby'}
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
              <div className="w-full h-16 bg-gray-200 rounded"></div>
            </div>)}
        </div>
      </div>;
  }
  return <div className="bg-white rounded-2xl p-6 shadow-sm py-[15px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
          Recipes for {babyName || 'Baby'}
        </h3>
        <button className="text-sm text-pink-500 hover:text-pink-600 font-medium" onClick={handleViewAll}>
          View All
        </button>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">📊 Progress:</span> You've tried {triedRecipesCount} recipe{triedRecipesCount !== 1 ? 's' : ''} so far! Keep exploring nutritious options for your baby.
        </p>
      </div>

      <div className="space-y-3">
        {recipes.length === 0 ? <div className="text-center py-4">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No recipes available</h4>
            <p className="text-gray-600 text-sm">Check back later for delicious recipe recommendations</p>
          </div> : recipes.map(recipe => (
          <div
            key={recipe._id}
            onClick={() => handleRecipeClick(recipe)}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer group overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={getRecipeImage(recipe)}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-xl"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = 'w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0';
                        parent.innerHTML =
                          '<svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {recipe.time || 'Quick'}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.servings ? `${recipe.servings} servings` : 'Family'}
                    </div>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>;
};
