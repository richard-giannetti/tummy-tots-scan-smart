
import { ProductData } from '../healthyTummiesScoreService';
import { ScanResult } from './types';

export class DataTransformService {
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
}
