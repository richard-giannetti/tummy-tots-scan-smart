
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanService } from '@/services/scanService';
import { toast } from '@/hooks/use-toast';
import SearchHeader from '@/components/SearchHeader';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import SearchTips from '@/components/SearchTips';

interface SearchResultProduct {
  code: string;
  product_name: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  nutriscore_grade?: string;
  nova_group?: number;
}

const SearchScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultProduct[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleProductSelect = async (product: SearchResultProduct) => {
    try {
      setIsSearching(true);
      
      // Get detailed product data using the barcode
      const productData = await ScanService.getProductByBarcode(product.code);
      
      if (productData) {
        const scanResult = ScanService.calculateHealthyTummiesScore(productData, 8);
        
        toast({
          title: "Product Selected!",
          description: `Loading ${productData.productName}`,
        });
        
        navigate('/scan-result', { 
          state: { scanResult }
        });
      } else {
        toast({
          title: "Error",
          description: "Could not load product details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(false);
    setSearchResults([]);
    
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
      
      // For text searches, use the Open Food Facts text search API
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

      // Filter products with valid names
      const validProducts = data.products.filter((product: any) => 
        product.product_name && product.product_name.trim().length > 0
      );

      if (validProducts.length === 0) {
        toast({
          title: "No Products Found",
          description: "No valid products found. Try different keywords.",
        });
        return;
      }

      // If only one result, go directly to it
      if (validProducts.length === 1) {
        const firstProduct = validProducts[0];
        
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

      // Multiple results - show them for selection
      setSearchResults(validProducts.slice(0, 10)); // Limit to 10 results
      setShowResults(true);
      
      toast({
        title: "Search Results",
        description: `Found ${validProducts.length} products. Choose one below.`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <SearchHeader />

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchForm
            searchQuery={searchQuery}
            isSearching={isSearching}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
          />

          {/* Search Results */}
          {showResults && (
            <SearchResults
              searchResults={searchResults}
              isSearching={isSearching}
              onProductSelect={handleProductSelect}
            />
          )}

          {/* Search Tips and Popular Searches */}
          {!showResults && (
            <SearchTips
              isSearching={isSearching}
              onQuickSearch={setSearchQuery}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchScreen;
