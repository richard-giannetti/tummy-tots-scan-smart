import { ProductData } from '../healthyTummiesScoreService';
import { ScanResult } from './types';

export class DataTransformService {
  static transformOpenFoodFactsData(productData: any): ProductData {
    console.log('Transforming Open Food Facts data:', productData);
    
    if (!productData) {
      console.error('No product data provided for transformation');
      throw new Error('No product data to transform');
    }

    const nutriments = productData.nutriments || {};
    console.log('Nutriments data:', nutriments);
    
    const transformedData: ProductData = {
      nutriscore_grade: productData.nutriscore_grade || productData.nutriscore_data?.grade,
      nova_group: productData.nova_group || productData.nova_groups,
      ecoscore_grade: productData.ecoscore_grade || productData.ecoscore_data?.grade,
      nutrients_per_100g: {
        energy_kcal: nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || nutriments.energy_kcal || 0,
        proteins: nutriments.proteins_100g || nutriments.proteins || 0,
        carbohydrates: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
        sugars: nutriments.sugars_100g || nutriments.sugars || 0,
        fiber: nutriments.fiber_100g || nutriments.fiber || 0,
        fat: nutriments.fat_100g || nutriments.fat || 0,
        saturated_fat: nutriments['saturated-fat_100g'] || nutriments.saturated_fat || 0,
        sodium: nutriments.sodium_100g || nutriments.sodium || 0,
        iron: nutriments.iron_100g || nutriments.iron,
        calcium: nutriments.calcium_100g || nutriments.calcium,
        vitamin_c: nutriments['vitamin-c_100g'] || nutriments.vitamin_c,
        vitamin_d: nutriments['vitamin-d_100g'] || nutriments.vitamin_d
      },
      ingredients_text: productData.ingredients_text || productData.ingredients_text_en || '',
      allergens: productData.allergens_tags || productData.allergens || [],
      additives: productData.additives_tags || productData.additives || [],
      product_name: productData.product_name || productData.product_name_en || 'Unknown Product'
    };

    console.log('Transformed data:', transformedData);
    return transformedData;
  }

  static createScanResult(openFoodFactsData: any, scoreResult: any, transformedData: ProductData): ScanResult {
    console.log('Creating scan result from:', { openFoodFactsData, scoreResult, transformedData });

    if (!scoreResult) {
      console.error('No score result provided');
      throw new Error('Score calculation failed');
    }

    const result: ScanResult = {
      product: {
        productName: transformedData.product_name || 'Unknown Product',
        brand: openFoodFactsData.brands || openFoodFactsData.brands_tags?.[0] || 'Unknown Brand',
        ingredients: transformedData.ingredients_text ? 
          transformedData.ingredients_text.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
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
        certifications: openFoodFactsData.labels_tags || openFoodFactsData.labels || [],
        imageUrl: openFoodFactsData.image_url || openFoodFactsData.image_front_url
      },
      healthyTummiesScore: scoreResult.final_score || 50,
      scoreInterpretation: scoreResult.score_interpretation || 'Moderate',
      scoreEmoji: scoreResult.score_emoji || '😐',
      scoreColor: scoreResult.score_color || 'text-yellow-600',
      primaryMessage: scoreResult.primary_message || 'Product analyzed',
      detailedExplanations: scoreResult.detailed_explanations || [],
      breakdown: scoreResult.breakdown || {
        age_appropriateness: 50,
        nutritional_quality: 50,
        safety_processing: 50,
        personalization: 50,
        external_scores: 50
      },
      nutriscore: transformedData.nutriscore_grade?.toUpperCase() || 'Unknown',
      novaGroup: transformedData.nova_group || 0,
      ecoscore: transformedData.ecoscore_grade?.toUpperCase() || 'Unknown',
      ageAppropriate: (scoreResult.breakdown?.age_appropriateness || 50) > 50,
      recommendations: this.generateRecommendations(scoreResult),
      warningFlags: this.generateWarningFlags(scoreResult, transformedData)
    };

    console.log('Created scan result:', result);
    return result;
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
