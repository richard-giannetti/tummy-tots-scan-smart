
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

      // Fetch from Open Food Facts
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        console.log('Product found in Open Food Facts:', product.product_name);
        
        // Cache the result
        await ProductCacheService.cacheProduct(barcode, product);
        
        return product;
      } else {
        console.log('Product not found in Open Food Facts');
        return null;
      }
    } catch (error) {
      console.error('Error fetching product from Open Food Facts:', error);
      return null;
    }
  }
}
