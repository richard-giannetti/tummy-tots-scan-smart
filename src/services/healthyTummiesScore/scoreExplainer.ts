
import { ScoreBreakdown, ProductData } from './types';
import { BabyProfile } from '../babyProfileService';
import { AgeCalculator } from './ageCalculator';
import { AdditiveAnalyzer } from './additiveAnalyzer';

export class ScoreExplainer {
  static generateExplanation(
    finalScore: number, 
    breakdown: ScoreBreakdown, 
    babyProfile: BabyProfile, 
    productData: ProductData
  ): { interpretation: string; emoji: string; color: string; message: string; explanations: string[] } {
    
    // Score interpretation based on ranges
    let interpretation: string;
    let emoji: string;
    let color: string;
    let message: string;

    if (finalScore >= 90) {
      interpretation = "Excellent choice for your baby";
      emoji = "🌟";
      color = "text-green-600";
      message = "This product meets the highest standards for baby nutrition and safety.";
    } else if (finalScore >= 70) {
      interpretation = "Good option with minor considerations";
      emoji = "✅";
      color = "text-green-500";
      message = "A solid choice with some minor areas for consideration.";
    } else if (finalScore >= 50) {
      interpretation = "Acceptable but consider alternatives";
      emoji = "⚠️";
      color = "text-yellow-500";
      message = "This product is acceptable but you might find better alternatives.";
    } else if (finalScore >= 30) {
      interpretation = "Use occasionally, not ideal for regular feeding";
      emoji = "🔶";
      color = "text-orange-500";
      message = "Consider limiting use and exploring healthier options.";
    } else {
      interpretation = "Not recommended for your baby";
      emoji = "❌";
      color = "text-red-500";
      message = "This product has significant concerns for baby nutrition and safety.";
    }

    const explanations: string[] = [];
    const babyAgeMonths = AgeCalculator.calculateBabyAgeInMonths(babyProfile.birth_date);

    // Age-specific messaging
    if (breakdown.age_appropriateness < 50) {
      explanations.push(`❌ Not suitable for ${babyAgeMonths}-month-old babies`);
    }

    // Safety concerns
    if (breakdown.safety_processing < 60) {
      const highRiskAdditives = AdditiveAnalyzer.getHighRiskAdditivesFound(productData.additives || []);
      if (highRiskAdditives.length > 0) {
        explanations.push(`⚠️ Contains ${highRiskAdditives.join(', ')} - not ideal for babies`);
      } else {
        explanations.push("⚠️ Contains multiple additives - consider alternatives");
      }
    }

    // Positive personalization
    if (breakdown.personalization > 80) {
      const goals = babyProfile.feeding_goals?.[0] || 'health';
      explanations.push(`✅ Great match for your baby's ${goals} goals`);
    }

    // Nutritional highlights
    if (breakdown.nutritional_quality > 75) {
      explanations.push("💪 Excellent nutritional profile for growing babies");
    } else if (breakdown.nutritional_quality < 40) {
      explanations.push("⚠️ Limited nutritional value - choose more nutritious options");
    }

    return { interpretation, emoji, color, message, explanations };
  }
}
