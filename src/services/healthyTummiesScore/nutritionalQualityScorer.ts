
import { NUTRITIONAL_RECOMMENDATIONS } from './constants';

export class NutritionalQualityScorer {
  static calculateScore(nutrients: any, babyAgeMonths: number): number {
    // Fix age group logic - use proper age ranges
    let ageGroup: number;
    if (babyAgeMonths < 6) {
      ageGroup = 6;
    } else if (babyAgeMonths < 12) {
      ageGroup = 12;
    } else if (babyAgeMonths < 24) {
      ageGroup = 24;
    } else {
      ageGroup = 36;
    }
    
    let qualityScore = 50; // Start with neutral baseline

    if (!nutrients) return qualityScore;

    // Positive nutritional factors
    const protein = nutrients.proteins || 0;
    const iron = nutrients.iron || 0;
    const calcium = nutrients.calcium || 0;
    const fiber = nutrients.fiber || 0;

    if (protein >= NUTRITIONAL_RECOMMENDATIONS.protein[ageGroup]) qualityScore += 20;
    if (iron >= NUTRITIONAL_RECOMMENDATIONS.iron[ageGroup]) qualityScore += 15;
    if (calcium >= NUTRITIONAL_RECOMMENDATIONS.calcium[ageGroup]) qualityScore += 10;
    if (fiber >= NUTRITIONAL_RECOMMENDATIONS.fiber[ageGroup]) qualityScore += 10;

    // Negative nutritional factors
    const saturatedFat = nutrients.saturated_fat || 0;
    const sodium = nutrients.sodium || 0;
    const sugars = nutrients.sugars || 0;

    if (saturatedFat > 3) qualityScore -= 15; // High saturated fat
    if (sodium > NUTRITIONAL_RECOMMENDATIONS.sodium[ageGroup]) qualityScore -= 20;
    if (sugars > NUTRITIONAL_RECOMMENDATIONS.sugars[ageGroup]) qualityScore -= 25;

    return Math.min(100, Math.max(0, qualityScore));
  }
}
