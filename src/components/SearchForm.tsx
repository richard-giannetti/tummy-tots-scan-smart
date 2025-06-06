
import React from 'react';
import { Search, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
}

const SearchForm = ({ searchQuery, isSearching, onSearchQueryChange, onSearch }: SearchFormProps) => {
  const navigate = useNavigate();

  const handleScanInstead = () => {
    navigate('/scan');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
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
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-lg py-6"
            disabled={isSearching}
          />
        </div>
        
        <Button
          onClick={onSearch}
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

        {/* Secondary Scan Button */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        
        <Button
          onClick={handleScanInstead}
          variant="outline"
          className="w-full py-4 text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <Camera className="w-5 h-5 mr-2" />
          Scan Barcode Instead
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
