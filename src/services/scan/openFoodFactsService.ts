
import { ProductCacheService } from './productCacheService';

export class OpenFoodFactsService {
  static async getProductByBarcode(barcode: string): Promise<any> {
    try {
      console.log(`Fetching product data for barcode: ${barcode}`);
      
      // Check cache first
      const cached = await ProductCacheService.getCachedProduct(barcode);
      if (cached) {
        console.log('Using cached product data');
        return cached;
      }

      // Fetch from Open Food Facts with better error handling
      console.log('Making API request to Open Food Facts...');
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
        method: 'GET',
        headers: {
          'User-Agent': 'HealthyTummies/1.0 (contact@healthytummies.com)',
          'Accept': 'application/json',
        },
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        console.log('Product found in Open Food Facts:', product.product_name || 'Unknown name');
        
        // Cache the result
        await ProductCacheService.cacheProduct(barcode, product);
        
        return product;
      } else {
        console.log('Product not found in Open Food Facts database');
        return null;
      }
    } catch (error) {
      console.error('Error fetching product from Open Food Facts:', error);
      // Re-throw the error with more context
      throw new Error(`Failed to fetch product data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
