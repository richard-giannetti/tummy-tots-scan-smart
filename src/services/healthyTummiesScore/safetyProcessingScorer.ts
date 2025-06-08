
import { ProductData } from './types';
import { BabyProfile } from '../babyProfileService';
import { AdditiveAnalyzer } from './additiveAnalyzer';
import { AgeCalculator } from './ageCalculator';

export class SafetyProcessingScorer {
  static calculateScore(productData: ProductData, babyProfile: BabyProfile): number {
    let baseScore = 100;
    const babyAgeMonths = AgeCalculator.calculateBabyAgeInMonths(babyProfile.birth_date);
    
    // NOVA processing penalty
    const novaGroup = productData.nova_group || 2;
    const processingPenalty = { 1: 0, 2: -10, 3: -25, 4: -40 };
    baseScore += processingPenalty[novaGroup as keyof typeof processingPenalty] || -20;

    // Additive penalties
    let totalAdditivePenalty = 0;
    const additives = productData.additives || [];
    
    for (const additive of additives) {
      const penalty = AdditiveAnalyzer.getAdditivesPenalty(additive, babyAgeMonths);
      totalAdditivePenalty += penalty;
      
      // Extra penalty for multiple high-risk additives
      if (penalty <= -30) {
        totalAdditivePenalty -= 5; // Compounding risk
      }
    }

    // Cap additive penalty to prevent extreme scores
    totalAdditivePenalty = Math.max(totalAdditivePenalty, -60);
    baseScore += totalAdditivePenalty;

    // Allergen check - critical safety factor
    const allergens = productData.allergens || [];
    for (const allergen of allergens) {
      if (babyProfile.allergies?.includes(allergen)) {
        return 0; // Instant disqualification
      }
    }

    // Age-specific additional penalties
    if (babyAgeMonths < 6) {
      if (additives.some(additive => additive.toLowerCase().includes('artificial'))) {
        baseScore -= 30;
      }
    } else if (babyAgeMonths < 12) {
      if (totalAdditivePenalty < -20) {
        baseScore -= 10; // Additional penalty for multiple additives
      }
    }

    // Ensure score stays within 0-100 range
    return Math.min(100, Math.max(0, baseScore));
  }
}
