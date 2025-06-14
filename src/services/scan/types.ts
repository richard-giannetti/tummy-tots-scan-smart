
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
