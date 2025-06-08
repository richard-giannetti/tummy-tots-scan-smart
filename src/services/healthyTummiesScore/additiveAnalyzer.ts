
import { ADDITIVE_RISK_LEVELS } from './constants';

export class AdditiveAnalyzer {
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
}
