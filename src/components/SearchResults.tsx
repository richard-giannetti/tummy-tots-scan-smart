
import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

interface SearchResultProduct {
  code: string;
  product_name: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  nutriscore_grade?: string;
  nova_group?: number;
}

interface SearchResultsProps {
  searchResults: SearchResultProduct[];
  isSearching: boolean;
  onProductSelect: (product: SearchResultProduct) => void;
}

const SearchResults = ({ searchResults, isSearching, onProductSelect }: SearchResultsProps) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Search Results</h3>
      <div className="space-y-3">
        {searchResults.map((product, index) => (
          <button
            key={`${product.code}-${index}`}
            onClick={() => onProductSelect(product)}
            disabled={isSearching}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start space-x-3">
              {/* Product Image */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {(product.image_front_url || product.image_url) ? (
                  <img 
                    src={product.image_front_url || product.image_url} 
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {product.product_name}
                </h4>
                {product.brands && (
                  <p className="text-sm text-gray-600 truncate">
                    {product.brands}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  {product.nutriscore_grade && (
                    <span className={`inline-block w-6 h-6 rounded text-white text-xs font-bold text-center leading-6 ${
                      product.nutriscore_grade.toLowerCase() === 'a' ? 'bg-green-500' :
                      product.nutriscore_grade.toLowerCase() === 'b' ? 'bg-yellow-500' :
                      product.nutriscore_grade.toLowerCase() === 'c' ? 'bg-orange-500' :
                      product.nutriscore_grade.toLowerCase() === 'd' ? 'bg-red-500' :
                      'bg-red-700'
                    }`}>
                      {product.nutriscore_grade.toUpperCase()}
                    </span>
                  )}
                  {product.nova_group && (
                    <span className="text-xs text-gray-500">
                      NOVA {product.nova_group}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
