
import { ProductData } from './types';

export class ExternalScoresIntegrator {
  static calculateScore(productData: ProductData): number {
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
}
