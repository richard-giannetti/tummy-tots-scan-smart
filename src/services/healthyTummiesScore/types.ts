
import { BabyProfile } from '../babyProfileService';

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
