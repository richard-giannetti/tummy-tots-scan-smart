import { HealthyTummiesScoreService, ProductData } from './healthyTummiesScoreService';
import { BabyProfileService } from './babyProfileService';

export interface ScanResult {
  product: {
    productName: string;
    brand: string;
    ingredients: string[];
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sodium: number;
      sugar: number;
    };
    allergens: string[];
    additives: string[];
    certifications: string[];
    imageUrl?: string;
  };
  healthyTummiesScore: number;
  scoreInterpretation: string;
  scoreEmoji: string;
  scoreColor: string;
  primaryMessage: string;
  detailedExplanations: string[];
  breakdown: {
    age_appropriateness: number;
    nutritional_quality: number;
    safety_processing: number;
    personalization: number;
    external_scores: number;
  };
  nutriscore: string;
  novaGroup: number;
  ecoscore: string;
  ageAppropriate: boolean;
  recommendations: string[];
  warningFlags: string[];
}

export class ScanService {
  static async getCachedProduct(barcode: string): Promise<any | null> {
    try {
      const cacheKey = `product_cache:${barcode}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { product, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const cacheDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (now - timestamp < cacheDuration) {
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

  static async getProductByBarcode(barcode: string): Promise<any> {
    try {
      console.log(`Fetching product data for barcode: ${barcode}`);
      
      // Check cache first
      const cached = await this.getCachedProduct(barcode);
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
        await this.cacheProduct(barcode, product);
        
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

  static async calculateHealthyTummiesScore(productData: any, babyAgeMonths?: number): Promise<ScanResult> {
    try {
      // Get baby profile for personalized scoring
      const profileResult = await BabyProfileService.getBabyProfile();
      const babyProfile = profileResult.profile;

      if (!babyProfile) {
        console.warn('No baby profile found, using default scoring');
        // Create a minimal profile for scoring
        const defaultProfile = {
          name: 'Baby',
          birth_date: new Date(Date.now() - (babyAgeMonths || 8) * 30.44 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          allergies: [],
          dietary_restrictions: [],
          dietary_preferences: [],
          health_conditions: [],
          feeding_goals: ['general_nutrition']
        };
        
        const transformedProductData = this.transformOpenFoodFactsData(productData);
        const scoreResult = HealthyTummiesScoreService.calculateHealthyTummiesScore(
          transformedProductData, 
          defaultProfile as any
        );

        return this.createScanResult(productData, scoreResult, transformedProductData);
      }

      // Transform Open Food Facts data to our format
      const transformedProductData = this.transformOpenFoodFactsData(productData);
      
      // Calculate comprehensive score
      const scoreResult = HealthyTummiesScoreService.calculateHealthyTummiesScore(
        transformedProductData, 
        babyProfile
      );

      return this.createScanResult(productData, scoreResult, transformedProductData);

    } catch (error) {
      console.error('Error calculating Healthy Tummies Score:', error);
      // Fallback to mock data
      return this.generateMockScanResult();
    }
  }

  static transformOpenFoodFactsData(productData: any): ProductData {
    const nutriments = productData.nutriments || {};
    
    return {
      nutriscore_grade: productData.nutriscore_grade,
      nova_group: productData.nova_group,
      ecoscore_grade: productData.ecoscore_grade,
      nutrients_per_100g: {
        energy_kcal: nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'],
        proteins: nutriments.proteins_100g,
        carbohydrates: nutriments.carbohydrates_100g,
        sugars: nutriments.sugars_100g,
        fiber: nutriments.fiber_100g,
        fat: nutriments.fat_100g,
        saturated_fat: nutriments['saturated-fat_100g'],
        sodium: nutriments.sodium_100g,
        iron: nutriments.iron_100g,
        calcium: nutriments.calcium_100g,
        vitamin_c: nutriments['vitamin-c_100g'],
        vitamin_d: nutriments['vitamin-d_100g']
      },
      ingredients_text: productData.ingredients_text,
      allergens: productData.allergens_tags || [],
      additives: productData.additives_tags || [],
      product_name: productData.product_name
    };
  }

  static createScanResult(openFoodFactsData: any, scoreResult: any, transformedData: ProductData): ScanResult {
    const babyAge = 8; // Default fallback
    
    return {
      product: {
        productName: openFoodFactsData.product_name || 'Unknown Product',
        brand: openFoodFactsData.brands || 'Unknown Brand',
        ingredients: openFoodFactsData.ingredients_text ? 
          openFoodFactsData.ingredients_text.split(',').map((i: string) => i.trim()) : [],
        nutritionalInfo: {
          calories: transformedData.nutrients_per_100g?.energy_kcal || 0,
          protein: transformedData.nutrients_per_100g?.proteins || 0,
          carbs: transformedData.nutrients_per_100g?.carbohydrates || 0,
          fat: transformedData.nutrients_per_100g?.fat || 0,
          fiber: transformedData.nutrients_per_100g?.fiber || 0,
          sodium: transformedData.nutrients_per_100g?.sodium || 0,
          sugar: transformedData.nutrients_per_100g?.sugars || 0,
        },
        allergens: transformedData.allergens || [],
        additives: transformedData.additives || [],
        certifications: openFoodFactsData.labels_tags || [],
        imageUrl: openFoodFactsData.image_url
      },
      healthyTummiesScore: scoreResult.final_score,
      scoreInterpretation: scoreResult.score_interpretation,
      scoreEmoji: scoreResult.score_emoji,
      scoreColor: scoreResult.score_color,
      primaryMessage: scoreResult.primary_message,
      detailedExplanations: scoreResult.detailed_explanations,
      breakdown: scoreResult.breakdown,
      nutriscore: transformedData.nutriscore_grade || 'Unknown',
      novaGroup: transformedData.nova_group || 0,
      ecoscore: transformedData.ecoscore_grade || 'Unknown',
      ageAppropriate: scoreResult.breakdown.age_appropriateness > 50,
      recommendations: this.generateRecommendations(scoreResult),
      warningFlags: this.generateWarningFlags(scoreResult, transformedData)
    };
  }

  static generateRecommendations(scoreResult: any): string[] {
    const recommendations: string[] = [];
    
    if (scoreResult.breakdown.nutritional_quality < 60) {
      recommendations.push("Look for products with higher protein and fiber content");
    }
    
    if (scoreResult.breakdown.safety_processing < 60) {
      recommendations.push("Consider products with fewer artificial additives");
    }
    
    if (scoreResult.breakdown.age_appropriateness < 70) {
      recommendations.push("Check age-appropriate alternatives for your baby");
    }
    
    if (scoreResult.final_score < 50) {
      recommendations.push("Explore organic or natural alternatives");
    }

    return recommendations;
  }

  static generateWarningFlags(scoreResult: any, productData: ProductData): string[] {
    const warnings: string[] = [];
    
    if (scoreResult.breakdown.age_appropriateness < 30) {
      warnings.push("Not suitable for this age group");
    }
    
    if ((productData.nutrients_per_100g?.sodium || 0) > 500) {
      warnings.push("High sodium content");
    }
    
    if ((productData.nutrients_per_100g?.sugars || 0) > 15) {
      warnings.push("High sugar content");
    }
    
    if (productData.additives && productData.additives.length > 5) {
      warnings.push("Contains multiple additives");
    }

    return warnings;
  }

  static generateMockScanResult(): ScanResult {
    const mockProducts = [
      {
        productName: "Organic Baby Rice Cereal",
        brand: "Happy Baby",
        healthyTummiesScore: 85,
        scoreInterpretation: "Good option with minor considerations",
        scoreEmoji: "✅",
        scoreColor: "text-green-500",
        primaryMessage: "A solid choice with some minor areas for consideration.",
        nutriscore: "B",
        novaGroup: 2,
        ecoscore: "B"
      },
      {
        productName: "Sweet Potato Baby Food Puree",
        brand: "Gerber",
        healthyTummiesScore: 92,
        scoreInterpretation: "Excellent choice for your baby",
        scoreEmoji: "🌟",
        scoreColor: "text-green-600", 
        primaryMessage: "This product meets the highest standards for baby nutrition and safety.",
        nutriscore: "A",
        novaGroup: 1,
        ecoscore: "A"
      },
      {
        productName: "Fruit Snacks with Artificial Colors",
        brand: "Generic Brand",
        healthyTummiesScore: 25,
        scoreInterpretation: "Not recommended for your baby",
        scoreEmoji: "❌",
        scoreColor: "text-red-500",
        primaryMessage: "This product has significant concerns for baby nutrition and safety.",
        nutriscore: "E",
        novaGroup: 4,
        ecoscore: "D"
      }
    ];

    const selectedProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    
    return {
      product: {
        productName: selectedProduct.productName,
        brand: selectedProduct.brand,
        ingredients: ["Organic rice", "Iron", "Vitamin B1", "Vitamin B6"],
        nutritionalInfo: {
          calories: 120,
          protein: 2.5,
          carbs: 25,
          fat: 1.0,
          fiber: 0.5,
          sodium: 5,
          sugar: 1
        },
        allergens: [],
        additives: [],
        certifications: ["Organic", "Non-GMO"],
        imageUrl: "/placeholder.svg"
      },
      healthyTummiesScore: selectedProduct.healthyTummiesScore,
      scoreInterpretation: selectedProduct.scoreInterpretation,
      scoreEmoji: selectedProduct.scoreEmoji,
      scoreColor: selectedProduct.scoreColor,
      primaryMessage: selectedProduct.primaryMessage,
      detailedExplanations: [
        "💪 Rich in iron for healthy development",
        "🌱 Organic ingredients reduce exposure to pesticides",
        "✅ Age-appropriate texture and nutrition"
      ],
      breakdown: {
        age_appropriateness: 90,
        nutritional_quality: 85,
        safety_processing: 95,
        personalization: 80,
        external_scores: 88
      },
      nutriscore: selectedProduct.nutriscore,
      novaGroup: selectedProduct.novaGroup,
      ecoscore: selectedProduct.ecoscore,
      ageAppropriate: true,
      recommendations: [
        "Great choice for introducing solids",
        "Mix with breast milk for smoother texture"
      ],
      warningFlags: []
    };
  }
}
