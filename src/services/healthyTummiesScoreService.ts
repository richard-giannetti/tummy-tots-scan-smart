
import { BabyProfile } from './babyProfileService';

// Research-based nutritional recommendations by age (WHO/AAP guidelines)
const NUTRITIONAL_RECOMMENDATIONS = {
  protein: { 6: 1.2, 12: 1.0, 24: 0.9, 36: 0.9 }, // g/kg/day
  iron: { 6: 11, 12: 7, 24: 7, 36: 10 }, // mg/day
  calcium: { 6: 200, 12: 260, 24: 700, 36: 700 }, // mg/day
  fiber: { 6: 5, 12: 8, 24: 14, 36: 16 }, // g/day
  sodium: { 6: 200, 12: 370, 24: 1000, 36: 1200 }, // mg/day max
  sugars: { 6: 0, 12: 25, 24: 25, 36: 25 } // g/day max
};

// Research-based additive risk categorization (AAP/FDA guidelines)
const ADDITIVE_RISK_LEVELS = {
  artificial_colors: {
    'red 40': -40, 'e129': -40,
    'yellow 5': -35, 'e102': -35,
    'yellow 6': -35, 'e110': -35,
    'blue 1': -30, 'e133': -30,
    'red 3': -45, 'e127': -45,
    'green 3': -40, 'e143': -40
  },
  preservatives_high_risk: {
    'bha': -35, 'e320': -35,
    'bht': -30, 'e321': -30,
    'tbhq': -25, 'e319': -25,
    'sodium benzoate': -20,
    'potassium bromate': -50
  },
  artificial_sweeteners: {
    'aspartame': -30, 'e951': -30,
    'acesulfame k': -25, 'e950': -25,
    'sucralose': -20, 'e955': -20,
    'saccharin': -35, 'e954': -35
  },
  emulsifiers: {
    'carrageenan': -15,
    'polysorbate 80': -20,
    'lecithin': -5
  },
  flavor_enhancers: {
    'msg': -25, 'e621': -25,
    'disodium guanylate': -15,
    'disodium inosinate': -15
  },
  thickeners_stabilizers: {
    'xanthan gum': -5,
    'guar gum': -5,
    'agar': -3
  },
  natural_preservatives: {
    'vitamin e': 0, 'tocopherols': 0,
    'vitamin c': 0, 'ascorbic acid': 0,
    'citric acid': -2,
    'salt': -5
  },
  natural_colors: {
    'beetroot extract': 0,
    'turmeric': 0,
    'annatto': -2,
    'caramel color': -8
  }
};

export interface ProductData {
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  nutrients_per_100g?: {
    energy_kcal?: number;
    proteins?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    fat?: number;
    saturated_fat?: number;
    sodium?: number;
    iron?: number;
    calcium?: number;
    vitamin_c?: number;
    vitamin_d?: number;
  };
  ingredients_text?: string;
  allergens?: string[];
  additives?: string[];
  product_name?: string;
}

export interface ScoreBreakdown {
  age_appropriateness: number;
  nutritional_quality: number;
  safety_processing: number;
  personalization: number;
  external_scores: number;
}

export interface HealthyTummiesScoreResult {
  final_score: number;
  score_interpretation: string;
  score_emoji: string;
  score_color: string;
  primary_message: string;
  detailed_explanations: string[];
  breakdown: ScoreBreakdown;
}

export class HealthyTummiesScoreService {
  
  static calculateBabyAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffInMs = now.getTime() - birth.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
  }

  static calculateAgeAppropriatenessScore(babyAgeMonths: number, productData: ProductData): number {
    let baseScore = 100;
    const ingredients = (productData.ingredients_text || '').toLowerCase();
    const sodium = productData.nutrients_per_100g?.sodium || 0;
    const sugars = productData.nutrients_per_100g?.sugars || 0;

    // Age-based restrictions
    if (babyAgeMonths < 6) {
      // Only breast milk/formula before 6 months
      if (!productData.product_name?.toLowerCase().includes('formula')) {
        return 0;
      }
    } else if (babyAgeMonths < 12) {
      // First foods (6-12 months) - strict guidelines
      let deductions = 0;
      if (ingredients.includes('honey')) deductions += 50; // Botulism risk
      if (ingredients.includes('whole nuts') || ingredients.includes('peanuts')) deductions += 40; // Choking hazard
      if (sodium > 200) deductions += 30; // Too much sodium
      if (sugars > 0) deductions += 25; // No added sugars
      baseScore -= deductions;
    } else if (babyAgeMonths < 24) {
      // Toddler foods (12-24 months)
      if (sodium > 400) baseScore -= 20;
      if (sugars > 5) baseScore -= 15;
    }

    return Math.max(0, baseScore);
  }

  static calculateNutritionalQualityScore(nutrients: any, babyAgeMonths: number): number {
    const ageGroup = babyAgeMonths < 12 ? 12 : babyAgeMonths < 24 ? 24 : 36;
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

  static getAdditivesPenalty(additive: string, babyAgeMonths: number): number {
    const additiveLower = additive.toLowerCase();
    
    // Search through all risk categories
    for (const [category, additiveMap] of Object.entries(ADDITIVE_RISK_LEVELS)) {
      for (const [riskAdditive, penalty] of Object.entries(additiveMap)) {
        if (additiveLower.includes(riskAdditive)) {
          // Extra caution for babies under 12 months
          if (babyAgeMonths < 12 && penalty < -20) {
            return penalty - 10;
          }
          return penalty;
        }
      }
    }
    
    // Unknown additive - moderate caution
    return -8;
  }

  static calculateSafetyProcessingScore(productData: ProductData, babyProfile: BabyProfile): number {
    let baseScore = 100;
    const babyAgeMonths = this.calculateBabyAgeInMonths(babyProfile.birth_date);
    
    // NOVA processing penalty
    const novaGroup = productData.nova_group || 2;
    const processingPenalty = { 1: 0, 2: -10, 3: -25, 4: -40 };
    baseScore += processingPenalty[novaGroup as keyof typeof processingPenalty] || -20;

    // Additive penalties
    let totalAdditivePenalty = 0;
    const additives = productData.additives || [];
    
    for (const additive of additives) {
      const penalty = this.getAdditivesPenalty(additive, babyAgeMonths);
      totalAdditivePenalty += penalty;
      
      // Extra penalty for multiple high-risk additives
      if (penalty <= -30) {
        totalAdditivePenalty -= 5; // Compounding risk
      }
    }

    // Cap additive penalty
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

    return Math.max(0, baseScore);
  }

  static calculatePersonalizationScore(productData: ProductData, babyProfile: BabyProfile): number {
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

  static calculateExternalScoresIntegration(productData: ProductData): number {
    // Convert external scores to 0-100 scale
    const nutriscorePoints = { 'a': 90, 'b': 70, 'c': 50, 'd': 30, 'e': 10 };
    const novaPoints = { 1: 90, 2: 70, 3: 40, 4: 10 };
    const ecoscorePoints = { 'a': 90, 'b': 70, 'c': 50, 'd': 30, 'e': 10 };

    const nutriscore = nutriscorePoints[productData.nutriscore_grade?.toLowerCase() as keyof typeof nutriscorePoints] || 50;
    const nova = novaPoints[productData.nova_group as keyof typeof novaPoints] || 50;
    const ecoscore = ecoscorePoints[productData.ecoscore_grade?.toLowerCase() as keyof typeof ecoscorePoints] || 50;

    // Weighted average (favor nutritional over environmental for babies)
    return nutriscore * 0.6 + nova * 0.3 + ecoscore * 0.1;
  }

  static generateScoreExplanation(
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
    const babyAgeMonths = this.calculateBabyAgeInMonths(babyProfile.birth_date);

    // Age-specific messaging
    if (breakdown.age_appropriateness < 50) {
      explanations.push(`❌ Not suitable for ${babyAgeMonths}-month-old babies`);
    }

    // Safety concerns
    if (breakdown.safety_processing < 60) {
      const highRiskAdditives = this.getHighRiskAdditivesFound(productData.additives || []);
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

  static getHighRiskAdditivesFound(additives: string[]): string[] {
    const highRisk: string[] = [];
    for (const additive of additives) {
      const penalty = this.getAdditivesPenalty(additive, 12);
      if (penalty <= -30) {
        const cleanName = additive.replace(/\(e/i, ' (E').replace(/\b\w/g, l => l.toUpperCase());
        highRisk.push(cleanName);
      }
    }
    return highRisk.slice(0, 3); // Limit to top 3 for UI clarity
  }

  static calculateHealthyTummiesScore(productData: ProductData, babyProfile: BabyProfile): HealthyTummiesScoreResult {
    const babyAgeMonths = this.calculateBabyAgeInMonths(babyProfile.birth_date);
    
    // Calculate component scores
    const ageScore = this.calculateAgeAppropriatenessScore(babyAgeMonths, productData);
    const nutritionScore = this.calculateNutritionalQualityScore(productData.nutrients_per_100g, babyAgeMonths);
    const safetyScore = this.calculateSafetyProcessingScore(productData, babyProfile);
    const personalizationScore = this.calculatePersonalizationScore(productData, babyProfile);
    const externalScore = this.calculateExternalScoresIntegration(productData);

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

    const explanation = this.generateScoreExplanation(finalScore, breakdown, babyProfile, productData);

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
