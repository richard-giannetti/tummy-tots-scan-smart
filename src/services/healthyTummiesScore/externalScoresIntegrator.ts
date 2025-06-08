
import { ProductData } from './types';

export class ExternalScoresIntegrator {
  static calculateScore(productData: ProductData): number {
    // Convert external scores to 0-100 scale with proper fallbacks
    const nutriscorePoints = { 'a': 90, 'b': 70, 'c': 50, 'd': 30, 'e': 10 };
    const novaPoints = { 1: 90, 2: 70, 3: 40, 4: 10 };
    const ecoscorePoints = { 'a': 90, 'b': 70, 'c': 50, 'd': 30, 'e': 10 };

    // Handle missing or invalid scores properly
    const nutriscore = productData.nutriscore_grade 
      ? nutriscorePoints[productData.nutriscore_grade.toLowerCase() as keyof typeof nutriscorePoints] || 50
      : 50;
    
    const nova = productData.nova_group && productData.nova_group >= 1 && productData.nova_group <= 4
      ? novaPoints[productData.nova_group as keyof typeof novaPoints]
      : 50;
    
    const ecoscore = productData.ecoscore_grade
      ? ecoscorePoints[productData.ecoscore_grade.toLowerCase() as keyof typeof ecoscorePoints] || 50
      : 50;

    // Weighted average (favor nutritional over environmental for babies)
    const finalScore = Math.round(nutriscore * 0.6 + nova * 0.3 + ecoscore * 0.1);
    
    // Ensure score stays within 0-100 range
    return Math.min(100, Math.max(0, finalScore));
  }
}
