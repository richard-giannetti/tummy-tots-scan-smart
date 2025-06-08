
import { ProductData } from './types';
import { BabyProfile } from '../babyProfileService';

export class PersonalizationScorer {
  static calculateScore(productData: ProductData, babyProfile: BabyProfile): number {
    let personalizationScore = 50; // Neutral baseline
    
    const healthConditions = babyProfile.health_conditions || [];
    const feedingGoals = babyProfile.feeding_goals || [];
    const dietaryPreferences = babyProfile.dietary_preferences || [];
    const nutrients = productData.nutrients_per_100g || {};

    // Health condition adjustments
    if (healthConditions.includes('reflux')) {
      if ((nutrients.fat || 0) < 3) personalizationScore += 10; // Low fat
    }

    if (healthConditions.includes('constipation')) {
      if ((nutrients.fiber || 0) >= 3) personalizationScore += 25; // High fiber
    }

    if (healthConditions.includes('eczema')) {
      if (!productData.allergens?.some(a => ['dairy', 'eggs', 'nuts'].includes(a))) {
        personalizationScore += 15; // Hypoallergenic
      }
    }

    // Feeding goals alignment
    if (feedingGoals.includes('brain_development')) {
      if ((nutrients.iron || 0) >= 2) personalizationScore += 15; // High iron
    }

    if (feedingGoals.includes('weight_gain')) {
      if ((nutrients.energy_kcal || 0) >= 100) personalizationScore += 20; // Higher calories
    }

    if (feedingGoals.includes('digestive_health')) {
      if ((nutrients.fiber || 0) >= 2) personalizationScore += 20; // Good fiber
    }

    // Dietary preferences
    if (dietaryPreferences.includes('organic_only')) {
      const isOrganic = (productData.ingredients_text || '').toLowerCase().includes('organic');
      if (isOrganic) {
        personalizationScore += 15;
      } else {
        personalizationScore -= 30;
      }
    }

    if (dietaryPreferences.includes('no_artificial_additives')) {
      const hasArtificial = (productData.additives || []).some(additive => 
        additive.toLowerCase().includes('artificial') || additive.startsWith('e')
      );
      if (!hasArtificial) {
        personalizationScore += 20;
      } else {
        personalizationScore -= 25;
      }
    }

    return Math.min(100, Math.max(0, personalizationScore));
  }
}
