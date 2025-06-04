
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IntroducedFoodsService, FoodWithIntroduction } from '@/services/introducedFoodsService';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FoodCard } from '@/components/FoodCard';
import { SearchFilters } from '@/components/SearchFilters';
import { FoodsPagination } from '@/components/FoodsPagination';
import { toast } from '@/hooks/use-toast';

const FoodFacts = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodWithIntroduction[]>([]);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'introduced' | 'not-introduced'>('all');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodWithIntroduction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchBabyProfile();
  }, []);

  useEffect(() => {
    if (babyProfile) {
      fetchFoods();
    }
  }, [babyProfile, currentPage, searchTerm, filterType]);

  const fetchBabyProfile = async () => {
    try {
      const profileResult = await BabyProfileService.getBabyProfile();
      if (profileResult.success && profileResult.profile) {
        setBabyProfile(profileResult.profile);
      } else {
        toast({
          title: "Error",
          description: "Please set up your baby profile first",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load baby profile",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const fetchFoods = async () => {
    if (!babyProfile) return;

    try {
      setSearchLoading(true);
      
      const result = await IntroducedFoodsService.getPaginatedFoodsWithIntroduction(
        babyProfile.id!,
        currentPage,
        itemsPerPage,
        searchTerm || undefined,
        filterType
      );

      if (result.success && result.data) {
        setFoods(result.data);
        setTotalCount(result.totalCount || 0);
      } else {
        console.error('Error fetching foods:', result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to load foods",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: 'all' | 'introduced' | 'not-introduced') => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        await fetchFoods();
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
      await fetchFoods();
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
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
        <SearchFilters
          searchTerm={searchTerm}
          filterType={filterType}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {/* Results Stats */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </span>
            ) : (
              `Showing ${foods.length} of ${totalCount} foods (page ${currentPage} of ${totalPages})`
            )}
          </p>
          {bulkMode && selectedFoods.length > 0 && (
            <p className="text-sm text-blue-600 font-medium">
              {selectedFoods.length} selected
            </p>
          )}
        </div>

        {/* Foods Grid */}
        {searchLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                bulkMode={bulkMode}
                isSelected={selectedFoods.includes(food._id)}
                onClick={handleFoodClick}
                onToggleIntroduced={handleToggleIntroduced}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <FoodsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {foods.length === 0 && !searchLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No foods found</p>
            <p className="text-sm text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No foods available in the database'
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentRoute="/food-facts" />

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
