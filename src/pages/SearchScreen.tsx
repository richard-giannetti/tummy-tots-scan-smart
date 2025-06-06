
import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanService } from '@/services/scanService';
import { ROUTES } from '@/constants/app';
import { toast } from '@/hooks/use-toast';

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
    
    try {
      // First try to search by barcode if the query looks like a barcode (all numbers)
      const isBarcode = /^\d{8,}$/.test(searchQuery.trim());
      
      if (isBarcode) {
        console.log('Searching by barcode:', searchQuery);
        const productData = await ScanService.getProductByBarcode(searchQuery.trim());
        
        if (productData) {
          const scanResult = ScanService.calculateHealthyTummiesScore(productData, 8);
          
          toast({
            title: "Product Found!",
            description: `Found ${productData.productName}`,
          });
          
          navigate('/scan-result', { 
            state: { scanResult }
          });
          return;
        }
      }
      
      // For text searches, we'll use the Open Food Facts text search API
      await searchByText(searchQuery.trim());
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchByText = async (query: string) => {
    try {
      // Use Open Food Facts search API
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,brands,nutriscore_grade,nova_group,ecoscore_grade,nutriments,ingredients_text,image_url,image_front_url`;
      
      console.log('Searching Open Food Facts for:', query);
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'HealthyTummies/1.0 (hello@healthy-tummies.com)',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
        toast({
          title: "No Products Found",
          description: "No products found matching your search. Try different keywords.",
        });
        return;
      }

      // Use the first result for now
      const firstProduct = data.products[0];
      
      if (!firstProduct.product_name) {
        toast({
          title: "No Products Found",
          description: "No valid products found. Try different keywords.",
        });
        return;
      }

      // Format the product data using the existing ScanService method
      const productData = {
        barcode: firstProduct.code,
        productName: firstProduct.product_name || firstProduct.product_name_en || 'Unknown Product',
        brand: firstProduct.brands || '',
        imageUrl: firstProduct.image_front_url || firstProduct.image_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop',
        nutriScore: firstProduct.nutriscore_grade?.toUpperCase(),
        novaScore: firstProduct.nova_group,
        ecoScore: firstProduct.ecoscore_grade?.toUpperCase(),
        nutritionalValues: {
          energy: firstProduct.nutriments?.['energy-kcal_100g'],
          sugar: firstProduct.nutriments?.sugars_100g,
          salt: firstProduct.nutriments?.salt_100g,
          saturatedFat: firstProduct.nutriments?.['saturated-fat_100g'],
          fiber: firstProduct.nutriments?.fiber_100g,
          protein: firstProduct.nutriments?.proteins_100g
        },
        ingredients: firstProduct.ingredients_text,
        allergens: firstProduct.allergens_tags || [],
        additives: firstProduct.additives_tags || [],
        categories: firstProduct.categories_tags || [],
      };

      // Calculate the Healthy Tummies score
      const scanResult = ScanService.calculateHealthyTummiesScore(productData, 8);
      
      toast({
        title: "Product Found!",
        description: `Found ${productData.productName}`,
      });
      
      // Navigate to scan result with the search result
      navigate('/scan-result', { 
        state: { scanResult }
      });
      
    } catch (error) {
      console.error('Text search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      });
    }
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
              <li>• Include keywords like "organic" or "baby food"</li>
            </ul>
          </div>

          {/* Recent Searches */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Popular Searches</h3>
            <div className="space-y-2">
              {['Apple puree baby food', 'Organic rice cereal', 'Banana baby food', 'Sweet potato puree'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(item)}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                  disabled={isSearching}
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
