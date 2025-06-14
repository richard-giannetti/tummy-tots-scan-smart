
export class ProductCacheService {
  private static readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  static async getCachedProduct(barcode: string): Promise<any | null> {
    try {
      const cacheKey = `product_cache:${barcode}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { product, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        
        if (now - timestamp < this.CACHE_DURATION) {
          return product;
        } else {
          localStorage.removeItem(cacheKey); // Remove expired cache
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static async cacheProduct(barcode: string, product: any): Promise<void> {
    try {
      const cacheKey = `product_cache:${barcode}`;
      const cacheData = {
        product: product,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }
}
