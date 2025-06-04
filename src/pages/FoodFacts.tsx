
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IntroducedFoodsService, FoodWithIntroduction } from '@/services/introducedFoodsService';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { toast } from '@/hooks/use-toast';

const FoodFacts = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodWithIntroduction[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodWithIntroduction[]>([]);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'introduced' | 'not-introduced'>('all');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodWithIntroduction | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, filterType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get baby profile
      const profileResult = await BabyProfileService.getBabyProfile();
      if (profileResult.success && profileResult.profile) {
        setBabyProfile(profileResult.profile);
        
        // Get foods with introduction status
        const foodsResult = await IntroducedFoodsService.getAllFoodsWithIntroduction(profileResult.profile.id!);
        if (foodsResult.success && foodsResult.data) {
          setFoods(foodsResult.data);
        } else {
          toast({
            title: "Error",
            description: foodsResult.error || "Failed to load foods",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please set up your baby profile first",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.foodType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Introduction status filter
    if (filterType === 'introduced') {
      filtered = filtered.filter(food => food.introduced);
    } else if (filterType === 'not-introduced') {
      filtered = filtered.filter(food => !food.introduced);
    }

    setFilteredFoods(filtered);
  };

  const handleFoodClick = (food: FoodWithIntroduction) => {
    if (bulkMode) {
      toggleFoodSelection(food._id);
    } else {
      setSelectedFood(food);
    }
  };

  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  const handleBulkMarkAsIntroduced = async () => {
    if (!babyProfile || selectedFoods.length === 0) return;

    try {
      const result = await IntroducedFoodsService.markFoodsAsIntroduced(babyProfile.id!, selectedFoods);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: `${selectedFoods.length} foods marked as introduced`,
        });
        setSelectedFoods([]);
        setBulkMode(false);
        await fetchData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark foods as introduced",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error marking foods as introduced:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleToggleIntroduced = async (food: FoodWithIntroduction) => {
    if (!babyProfile) return;

    try {
      if (food.introduced) {
        const result = await IntroducedFoodsService.unmarkFoodAsIntroduced(babyProfile.id!, food._id);
        if (result.success) {
          toast({
            title: "Success!",
            description: `${food.name} removed from introduced foods`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update food status",
            variant: "destructive",
          });
        }
      } else {
        const result = await IntroducedFoodsService.markFoodAsIntroduced(babyProfile.id!, food._id);
        if (result.success) {
          toast({
            title: "Success!",
            description: `${food.name} marked as introduced`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update food status",
            variant: "destructive",
          });
        }
      }
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error toggling food introduction status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-gray-600">Loading foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Food Facts</h1>
              <p className="text-sm text-gray-600">
                {babyProfile ? `For ${babyProfile.name}` : 'Discover safe foods for your baby'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (bulkMode && selectedFoods.length > 0) {
                handleBulkMarkAsIntroduced();
              } else {
                setBulkMode(!bulkMode);
                setSelectedFoods([]);
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              bulkMode 
                ? selectedFoods.length > 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={bulkMode && selectedFoods.length === 0}
          >
            {bulkMode 
              ? selectedFoods.length > 0 
                ? `Mark ${selectedFoods.length} as Introduced`
                : 'Cancel'
              : 'Bulk Select'
            }
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Foods</option>
                <option value="introduced">Introduced</option>
                <option value="not-introduced">Not Introduced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Stats */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredFoods.length} of {foods.length} foods
          </p>
          {bulkMode && selectedFoods.length > 0 && (
            <p className="text-sm text-blue-600 font-medium">
              {selectedFoods.length} selected
            </p>
          )}
        </div>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <div
              key={food._id}
              onClick={() => handleFoodClick(food)}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                bulkMode && selectedFoods.includes(food._id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {food.Image ? (
                    <img 
                      src={food.Image} 
                      alt={food.name || 'Food'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <span className="text-2xl">🍎</span>
                  )}
                  <span className="text-2xl hidden">🍎</span>
                </div>
                <div className="flex items-center gap-2">
                  {bulkMode ? (
                    selectedFoods.includes(food._id) ? (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleIntroduced(food);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {food.introduced ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-1">
                {food.name || 'Unknown Food'}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                {food.foodType && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {food.foodType}
                  </span>
                )}
                {food.introduced && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Introduced
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {food.ageSuggestion || food.introductionSummary || 'Tap to learn more about this food'}
              </p>
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No foods found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          babyName={babyProfile?.name}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          onToggleIntroduced={handleToggleIntroduced}
        />
      )}
    </div>
  );
};

export default FoodFacts;
