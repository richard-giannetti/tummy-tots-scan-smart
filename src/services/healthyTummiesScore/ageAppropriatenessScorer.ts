
import { ProductData } from './types';

export class AgeAppropriatenessScorer {
  static calculateScore(babyAgeMonths: number, productData: ProductData): number {
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

    // Ensure score stays within 0-100 range
    return Math.min(100, Math.max(0, baseScore));
  }
}
