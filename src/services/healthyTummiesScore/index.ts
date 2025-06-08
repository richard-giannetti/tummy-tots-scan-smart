
import { ProductData, ScoreBreakdown, HealthyTummiesScoreResult } from './types';
import { BabyProfile } from '../babyProfileService';
import { AgeCalculator } from './ageCalculator';
import { AgeAppropriatenessScorer } from './ageAppropriatenessScorer';
import { NutritionalQualityScorer } from './nutritionalQualityScorer';
import { SafetyProcessingScorer } from './safetyProcessingScorer';
import { PersonalizationScorer } from './personalizationScorer';
import { ExternalScoresIntegrator } from './externalScoresIntegrator';
import { ScoreExplainer } from './scoreExplainer';

export class HealthyTummiesScoreService {
  static calculateBabyAgeInMonths = AgeCalculator.calculateBabyAgeInMonths;

  static calculateHealthyTummiesScore(productData: ProductData, babyProfile: BabyProfile): HealthyTummiesScoreResult {
    const babyAgeMonths = AgeCalculator.calculateBabyAgeInMonths(babyProfile.birth_date);
    
    // Calculate component scores
    const ageScore = AgeAppropriatenessScorer.calculateScore(babyAgeMonths, productData);
    const nutritionScore = NutritionalQualityScorer.calculateScore(productData.nutrients_per_100g, babyAgeMonths);
    const safetyScore = SafetyProcessingScorer.calculateScore(productData, babyProfile);
    const personalizationScore = PersonalizationScorer.calculateScore(productData, babyProfile);
    const externalScore = ExternalScoresIntegrator.calculateScore(productData);

    // Weighted final score
    const finalScore = Math.round(
      ageScore * 0.30 +
      nutritionScore * 0.25 +
      safetyScore * 0.20 +
      personalizationScore * 0.15 +
      externalScore * 0.10
    );

    const breakdown: ScoreBreakdown = {
      age_appropriateness: ageScore,
      nutritional_quality: nutritionScore,
      safety_processing: safetyScore,
      personalization: personalizationScore,
      external_scores: externalScore
    };

    const explanation = ScoreExplainer.generateExplanation(finalScore, breakdown, babyProfile, productData);

    return {
      final_score: finalScore,
      score_interpretation: explanation.interpretation,
      score_emoji: explanation.emoji,
      score_color: explanation.color,
      primary_message: explanation.message,
      detailed_explanations: explanation.explanations,
      breakdown
    };
  }
}

// Export types for use in other files
export type { ProductData, ScoreBreakdown, HealthyTummiesScoreResult };
