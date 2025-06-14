
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipesService, Recipe } from '@/services/recipes';
import { BottomNavigation } from '@/components/BottomNavigation';
import { RecipeCard } from '@/components/RecipeCard';

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'popular' | 'recent'>('alphabetical');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, [filterBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        fetchRecipes();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let result;
      
      if (filterBy === 'favorites') {
        result = await RecipesService.getFavoriteRecipes();
      } else {
        result = await RecipesService.getRecipes(1, 50);
      }
      
      if (result.success && result.recipes) {
        setRecipes(result.recipes);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      const result = await RecipesService.searchRecipes(searchTerm);
      
      if (result.success && result.recipes) {
        setRecipes(result.recipes);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recent':
        return b._id.localeCompare(a._id);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button 
            onClick={() => navigate('/')}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">BLW Recipes</h1>
            <p className="text-sm text-gray-600">180+ Baby-Led Weaning Recipes</p>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              <option value="alphabetical">A-Z</option>
              <option value="popular">Popular</option>
              <option value="recent">Recent</option>
            </select>
          </div>
          
          {/* Filter by favorites */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterBy === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Recipes
            </button>
            <button
              onClick={() => setFilterBy('favorites')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterBy === 'favorites'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ❤️ Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading || isSearching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {filterBy === 'favorites' ? '❤️' : '🔍'}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {filterBy === 'favorites' ? 'No favorite recipes yet' : 'No recipes found'}
            </h3>
            <p className="text-gray-600">
              {filterBy === 'favorites' 
                ? 'Start adding recipes to your favorites!' 
                : 'Try adjusting your search terms'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentRoute="/recipes" />
    </div>
  );
};

export default Recipes;
