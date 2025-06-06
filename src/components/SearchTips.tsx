
import React from 'react';

interface SearchTipsProps {
  isSearching: boolean;
  onQuickSearch: (query: string) => void;
}

const SearchTips = ({ isSearching, onQuickSearch }: SearchTipsProps) => {
  const popularSearches = ['Apple puree baby food', 'Organic rice cereal', 'Banana baby food', 'Sweet potato puree'];

  return (
    <>
      <div className="bg-blue-50 rounded-2xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Search Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Try product names like "apple puree" or "baby cereal"</li>
          <li>• Enter barcode numbers for exact matches</li>
          <li>• Search by brand names like "Gerber" or "Earth's Best"</li>
          <li>• Include keywords like "organic" or "baby food"</li>
        </ul>
      </div>

      {/* Popular Searches */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Popular Searches</h3>
        <div className="space-y-2">
          {popularSearches.map((item, index) => (
            <button
              key={index}
              onClick={() => onQuickSearch(item)}
              className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
              disabled={isSearching}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchTips;
