
import { HealthyTummiesScoreService } from './healthyTummiesScoreService';
import { BabyProfileService } from './babyProfileService';
import { OpenFoodFactsService } from './scan/openFoodFactsService';
import { DataTransformService } from './scan/dataTransformService';
import { MockDataService } from './scan/mockDataService';
import { ScanRecordService } from './scan/scanRecordService';

// Re-export types for backwards compatibility
export type { ScanResult } from './scan/types';

export class ScanService {
  // Re-export methods for backwards compatibility
  static async getCachedProduct(barcode: string) {
    // This method is now handled internally by OpenFoodFactsService
    return null;
  }

  static async cacheProduct(barcode: string, product: any) {
    // This method is now handled internally by OpenFoodFactsService
    return;
  }

  static async getProductByBarcode(barcode: string) {
    return OpenFoodFactsService.getProductByBarcode(barcode);
  }

  static async calculateHealthyTummiesScore(productData: any, babyAgeMonths?: number) {
    try {
      // Get baby profile for personalized scoring
      const profileResult = await BabyProfileService.getBabyProfile();
      const babyProfile = profileResult.profile;

      if (!babyProfile) {
        console.warn('No baby profile found, using default scoring');
        // Create a minimal profile for scoring
        const defaultProfile = {
          name: 'Baby',
          birth_date: new Date(Date.now() - (babyAgeMonths || 8) * 30.44 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          allergies: [],
          dietary_restrictions: [],
          dietary_preferences: [],
          health_conditions: [],
          feeding_goals: ['general_nutrition']
        };
        
        const transformedProductData = DataTransformService.transformOpenFoodFactsData(productData);
        const scoreResult = HealthyTummiesScoreService.calculateHealthyTummiesScore(
          transformedProductData, 
          defaultProfile as any
        );

        return DataTransformService.createScanResult(productData, scoreResult, transformedProductData);
      }

      // Transform Open Food Facts data to our format
      const transformedProductData = DataTransformService.transformOpenFoodFactsData(productData);
      
      // Calculate comprehensive score
      const scoreResult = HealthyTummiesScoreService.calculateHealthyTummiesScore(
        transformedProductData, 
        babyProfile
      );

      return DataTransformService.createScanResult(productData, scoreResult, transformedProductData);

    } catch (error) {
      console.error('Error calculating Healthy Tummies Score:', error);
      // Fallback to mock data
      return MockDataService.generateMockScanResult();
    }
  }

  static async recordScan(userId: string, scanResult?: any, barcode?: string) {
    return ScanRecordService.recordScan(userId, scanResult, barcode);
  }

  static transformOpenFoodFactsData(productData: any) {
    return DataTransformService.transformOpenFoodFactsData(productData);
  }

  static createScanResult(openFoodFactsData: any, scoreResult: any, transformedData: any) {
    return DataTransformService.createScanResult(openFoodFactsData, scoreResult, transformedData);
  }

  static generateRecommendations(scoreResult: any) {
    return DataTransformService.generateRecommendations(scoreResult);
  }

  static generateWarningFlags(scoreResult: any, productData: any) {
    return DataTransformService.generateWarningFlags(scoreResult, productData);
  }

  static generateMockScanResult() {
    return MockDataService.generateMockScanResult();
  }
}
