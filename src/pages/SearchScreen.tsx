
import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanService } from '@/services/scanService';
import { ROUTES } from '@/constants/app';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Generate mock result based on search query
      const mockResult = ScanService.generateMockScanResult();
      
      // Update product name to reflect search query
      mockResult.product.productName = searchQuery.includes('puree') 
        ? 'Organic Apple & Banana Puree'
        : searchQuery.includes('cereal')
        ? 'Baby Rice Cereal'
        : searchQuery.includes('yogurt')
        ? 'Organic Baby Yogurt'
        : `${searchQuery} Baby Food`;

      setIsSearching(false);
      
      // Navigate to scan result with the mock data
      navigate('/scan-result', { 
        state: { scanResult: mockResult }
      });
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header with back button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Search Food</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Icon and Title */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
              <Search className="w-12 h-12 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Baby Food</h2>
              <p className="text-gray-600">
                Enter the name, barcode, or any details about the food product you want to check
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium text-gray-700">
                Food Product Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="e.g., apple puree, baby cereal, 1234567890..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-6"
                disabled={isSearching}
              />
            </div>
            
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold rounded-xl"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="w-6 h-6" />
                  <span>Search Food</span>
                </div>
              )}
            </Button>
          </div>

          {/* Search Tips */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Search Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Try product names like "apple puree" or "baby cereal"</li>
              <li>• Enter barcode numbers for exact matches</li>
              <li>• Search by brand names like "Gerber" or "Earth's Best"</li>
              <li>• Include age ranges like "6+ months baby food"</li>
            </ul>
          </div>

          {/* Recent Searches - Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {['Apple & Banana Puree', 'Organic Rice Cereal', 'Sweet Potato Baby Food'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(item)}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchScreen;
