
import { supabase } from '@/integrations/supabase/client';

export interface ScanResponse {
  success: boolean;
  error?: string;
}

export interface MockScanResult {
  score: number;
  productName: string;
  recommendations: string[];
}

export interface ProductData {
  barcode?: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  nutriScore?: string;
  nutritionalValues: {
    energy?: number;
    sugar?: number;
    salt?: number;
    saturatedFat?: number;
    fiber?: number;
    protein?: number;
  };
  ingredients?: string;
  allergens?: string[];
  additives?: string[];
  categories?: string[];
  novaGroup?: number;
}

export interface ScanResult {
  product: ProductData;
  healthyTummiesScore: number;
  breakdown: {
    sugarScore: number;
    saltScore: number;
    additivesScore: number;
    allergenWarnings: string[];
    nutritionalBenefits: string[];
  };
  recommendations: string[];
  ageAppropriate: boolean;
  warnings: string[];
}

/**
 * Service for handling food scanning operations and Open Food Facts API integration
 */
export class ScanService {
  private static BASE_URL = 'https://world.openfoodfacts.org/api/v2/product/';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get product data from Open Food Facts API
   */
  static async getProductByBarcode(barcode: string): Promise<ProductData | null> {
    try {
      console.log('ScanService: Fetching product data for barcode:', barcode);
      
      // Check cache first
      const cached = this._getCachedResult(barcode);
      if (cached) {
        console.log('ScanService: Using cached result');
        return cached;
      }

      const response = await fetch(`${this.BASE_URL}${barcode}.json`);
      
      if (!response.ok) {
        console.error('ScanService: API request failed:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.status === 0) {
        console.log('ScanService: Product not found');
        return null;
      }

      const productData = this._formatProductData(data.product);
      
      // Cache the result
      this._cacheResult(barcode, productData);
      
      return productData;
    } catch (error: any) {
      console.error('ScanService: Error fetching product:', error);
      return null;
    }
  }

  /**
   * Calculate Healthy Tummies score based on product data and baby profile
   */
  static calculateHealthyTummiesScore(productData: ProductData, babyAge: number): ScanResult {
    console.log('ScanService: Calculating Healthy Tummies score');
    
    // Base score from Nutri-Score
    let baseScore = this._convertNutriScore(productData.nutriScore);
    
    // Age-specific adjustments
    const ageAdjustments = this._calculateAgeAdjustments(productData, babyAge);
    
    // Nutritional penalties and bonuses
    const nutritionalScore = this._calculateNutritionalScore(productData.nutritionalValues, babyAge);
    
    // Additive penalties
    const additiveScore = this._calculateAdditiveScore(productData.additives || []);
    
    // Final score calculation
    const finalScore = Math.max(0, Math.min(100, 
      baseScore + ageAdjustments + nutritionalScore + additiveScore
    ));

    const breakdown = this._generateBreakdown(productData, babyAge);
    
    return {
      product: productData,
      healthyTummiesScore: Math.round(finalScore),
      breakdown,
      recommendations: this._generateRecommendations(finalScore, babyAge),
      ageAppropriate: finalScore >= 60 && babyAge >= 6,
      warnings: this._generateWarnings(productData, babyAge)
    };
  }

  /**
   * Record a scan in the user's tracking data
   */
  static async recordScan(userId: string, score?: number): Promise<ScanResponse> {
    try {
      console.log('ScanService: Recording scan for user:', userId, 'with score:', score);
      
      const { error } = await supabase.rpc('update_scan_tracking', {
        user_uuid: userId,
        scan_score: score || null
      });

      if (error) {
        console.error('ScanService: Error recording scan:', error);
        return { success: false, error: error.message };
      }

      console.log('ScanService: Scan recorded successfully');
      return { success: true };
    } catch (error: any) {
      console.error('ScanService: Unexpected error recording scan:', error);
      return { success: false, error: error.message || 'Failed to record scan' };
    }
  }

  /**
   * Generate a mock scan result for testing purposes
   */
  static generateMockScanResult(): ScanResult {
    const mockProducts = [
      {
        productName: 'Organic Baby Oats',
        brand: 'Happy Baby',
        imageUrl: '/placeholder.svg',
        nutriScore: 'A',
        nutritionalValues: {
          energy: 380,
          sugar: 1.2,
          salt: 0.01,
          saturatedFat: 1.5,
          fiber: 8.0,
          protein: 13.0
        },
        ingredients: 'Organic whole grain oats',
        allergens: [],
        additives: [],
        categories: ['baby-food', 'cereals'],
        novaGroup: 1
      },
      {
        productName: 'Fruit Puree Pouch',
        brand: 'Gerber',
        imageUrl: '/placeholder.svg',
        nutriScore: 'B',
        nutritionalValues: {
          energy: 65,
          sugar: 12.5,
          salt: 0.02,
          saturatedFat: 0.1,
          fiber: 2.0,
          protein: 0.5
        },
        ingredients: 'Apple puree, banana puree, vitamin C',
        allergens: [],
        additives: ['vitamin-c'],
        categories: ['baby-food', 'fruit-purees'],
        novaGroup: 2
      }
    ];

    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const babyAge = 8; // Default 8 months for mock
    
    return this.calculateHealthyTummiesScore(randomProduct, babyAge);
  }

  /**
   * Get user's scan summary data
   */
  static async getUserScanSummary(userId: string) {
    try {
      console.log('ScanService: Fetching scan summary for user:', userId);
      
      const { data, error } = await supabase
        .from('scan_summary')
        .select('*')
        .eq('user_id', userId)
        .order('scan_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('ScanService: Error fetching scan summary:', error);
        return { success: false, error: error.message };
      }

      console.log('ScanService: Fetched scan summary successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('ScanService: Unexpected error fetching scan summary:', error);
      return { success: false, error: error.message || 'Failed to fetch scan data' };
    }
  }

  // Private helper methods
  private static _formatProductData(product: any): ProductData {
    return {
      productName: product.product_name || product.product_name_en || 'Unknown Product',
      brand: product.brands || '',
      imageUrl: product.image_front_url || product.image_url || '/placeholder.svg',
      nutriScore: product.nutriscore_grade?.toUpperCase(),
      nutritionalValues: {
        energy: product.nutriments?.['energy-kcal_100g'],
        sugar: product.nutriments?.sugars_100g,
        salt: product.nutriments?.salt_100g,
        saturatedFat: product.nutriments?.['saturated-fat_100g'],
        fiber: product.nutriments?.fiber_100g,
        protein: product.nutriments?.proteins_100g
      },
      ingredients: product.ingredients_text,
      allergens: product.allergens_tags || [],
      additives: product.additives_tags || [],
      categories: product.categories_tags || [],
      novaGroup: product.nova_group
    };
  }

  private static _convertNutriScore(nutriScore?: string): number {
    const scores = { 'A': 90, 'B': 75, 'C': 60, 'D': 45, 'E': 30 };
    return scores[nutriScore as keyof typeof scores] || 50;
  }

  private static _calculateAgeAdjustments(product: ProductData, babyAge: number): number {
    let adjustment = 0;
    
    // Babies under 6 months shouldn't have solid food
    if (babyAge < 6) {
      adjustment -= 50;
    }
    
    // Age-appropriate texture considerations
    if (babyAge < 9 && product.categories?.some(cat => cat.includes('whole-grain'))) {
      adjustment -= 10;
    }
    
    return adjustment;
  }

  private static _calculateNutritionalScore(nutritional: ProductData['nutritionalValues'], babyAge: number): number {
    let score = 0;
    
    // Sugar penalties (babies should have minimal added sugar)
    if (nutritional.sugar && nutritional.sugar > 5) {
      score -= Math.min(20, (nutritional.sugar - 5) * 2);
    }
    
    // Salt penalties (babies need very low sodium)
    if (nutritional.salt && nutritional.salt > 0.25) {
      score -= Math.min(25, (nutritional.salt - 0.25) * 40);
    }
    
    // Fiber bonus (good for digestion)
    if (nutritional.fiber && nutritional.fiber > 3) {
      score += Math.min(10, nutritional.fiber - 3);
    }
    
    // Protein bonus
    if (nutritional.protein && nutritional.protein > 5) {
      score += Math.min(10, (nutritional.protein - 5) / 2);
    }
    
    return score;
  }

  private static _calculateAdditiveScore(additives: string[]): number {
    // Penalize products with many additives
    return Math.max(-20, -additives.length * 2);
  }

  private static _generateBreakdown(product: ProductData, babyAge: number) {
    const sugar = product.nutritionalValues.sugar || 0;
    const salt = product.nutritionalValues.salt || 0;
    
    return {
      sugarScore: sugar <= 5 ? 90 : Math.max(20, 90 - (sugar - 5) * 10),
      saltScore: salt <= 0.25 ? 95 : Math.max(10, 95 - (salt - 0.25) * 100),
      additivesScore: Math.max(40, 90 - (product.additives?.length || 0) * 10),
      allergenWarnings: product.allergens || [],
      nutritionalBenefits: this._identifyBenefits(product.nutritionalValues)
    };
  }

  private static _identifyBenefits(nutritional: ProductData['nutritionalValues']): string[] {
    const benefits = [];
    
    if (nutritional.fiber && nutritional.fiber > 3) {
      benefits.push('High in fiber for healthy digestion');
    }
    
    if (nutritional.protein && nutritional.protein > 8) {
      benefits.push('Good source of protein for growth');
    }
    
    if (nutritional.sugar && nutritional.sugar < 2) {
      benefits.push('Low in sugar');
    }
    
    return benefits;
  }

  private static _generateRecommendations(score: number, babyAge: number): string[] {
    if (score >= 80) {
      return [
        'Excellent choice for your baby!',
        'Rich in nutrients for healthy development',
        'Age-appropriate ingredients'
      ];
    } else if (score >= 60) {
      return [
        'Good option with some considerations',
        'Consider organic alternatives when possible',
        'Monitor serving sizes'
      ];
    } else {
      return [
        'Consider healthier alternatives',
        'High in sugar or salt for babies',
        'Look for organic, whole food options'
      ];
    }
  }

  private static _generateWarnings(product: ProductData, babyAge: number): string[] {
    const warnings = [];
    
    if (babyAge < 6) {
      warnings.push('Not suitable for babies under 6 months');
    }
    
    if (product.nutritionalValues.salt && product.nutritionalValues.salt > 0.5) {
      warnings.push('High sodium content - limit serving size');
    }
    
    if (product.nutritionalValues.sugar && product.nutritionalValues.sugar > 10) {
      warnings.push('High sugar content - offer occasionally');
    }
    
    if (product.allergens && product.allergens.length > 0) {
      warnings.push('Contains potential allergens - check ingredients');
    }
    
    return warnings;
  }

  private static _getCachedResult(barcode: string): ProductData | null {
    try {
      const cached = localStorage.getItem(`scan_${barcode}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  private static _cacheResult(barcode: string, data: ProductData): void {
    try {
      localStorage.setItem(`scan_${barcode}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching result:', error);
    }
  }
}
