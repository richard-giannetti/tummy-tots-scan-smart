
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, CheckCircle, Circle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IntroducedFoodsService, FoodWithIntroduction } from '@/services/introducedFoodsService';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  
  const itemsPerPage = 10; // Changed from 25 to 10
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (value: 'all' | 'introduced' | 'not-introduced') => {
    setFilterType(value);
    setCurrentPage(1); // Reset to first page when filtering
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
        await fetchFoods(); // Fixed: changed from fetchData to fetchFoods
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
      await fetchFoods(); // Fixed: changed from fetchData to fetchFoods
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
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value as any)}
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

        {/* Foods Grid - Made more compact */}
        {searchLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
            {foods.map((food) => (
              <div
                key={food._id}
                onClick={() => handleFoodClick(food)}
                className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  bulkMode && selectedFoods.includes(food._id) 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      <span className="text-lg">🍎</span>
                    )}
                    <span className="text-lg hidden">🍎</span>
                  </div>
                  <div className="flex items-center">
                    {bulkMode ? (
                      selectedFoods.includes(food._id) ? (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
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
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
                  {food.name || 'Unknown Food'}
                </h3>
                
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  {food.foodType && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {food.foodType}
                    </span>
                  )}
                  {food.introduced && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      Introduced
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {food.ageSuggestion || food.introductionSummary || 'Tap to learn more about this food'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

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
