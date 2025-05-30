
import { supabase } from '@/integrations/supabase/client';

export interface ScanResponse {
  success: boolean;
  error?: string;
}

export interface MockScanResult {
  score: number;
  productName: string;
  recommendations: string[];
}

/**
 * Service for handling food scanning operations and tracking
 */
export class ScanService {
  /**
   * Record a scan in the user's tracking data
   */
  static async recordScan(userId: string, score?: number): Promise<ScanResponse> {
    try {
      console.log('ScanService: Recording scan for user:', userId, 'with score:', score);
      
      const { error } = await supabase.rpc('update_scan_tracking', {
        user_uuid: userId,
        scan_score: score || null
      });

      if (error) {
        console.error('ScanService: Error recording scan:', error);
        return { success: false, error: error.message };
      }

      console.log('ScanService: Scan recorded successfully');
      return { success: true };
    } catch (error: any) {
      console.error('ScanService: Unexpected error recording scan:', error);
      return { success: false, error: error.message || 'Failed to record scan' };
    }
  }

  /**
   * Generate a mock scan result for testing purposes
   */
  static generateMockScanResult(): MockScanResult {
    const scores = [65, 72, 78, 85, 91, 88, 76, 82];
    const products = [
      'Organic Baby Oats',
      'Fruit Puree Pouch',
      'Baby Rice Cereal',
      'Vegetable Medley',
      'Apple Sauce',
      'Sweet Potato Puree'
    ];
    const recommendations = [
      'Great choice for baby\'s development!',
      'Consider organic alternatives',
      'Check sodium content',
      'Perfect for introducing new flavors',
      'Rich in essential vitamins',
      'Suitable for baby\'s age group'
    ];

    const randomScore = scores[Math.floor(Math.random() * scores.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomRecommendations = recommendations.slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      score: randomScore,
      productName: randomProduct,
      recommendations: randomRecommendations
    };
  }

  /**
   * Get user's scan summary data
   */
  static async getUserScanSummary(userId: string) {
    try {
      console.log('ScanService: Fetching scan summary for user:', userId);
      
      const { data, error } = await supabase
        .from('scan_summary')
        .select('*')
        .eq('user_id', userId)
        .order('scan_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('ScanService: Error fetching scan summary:', error);
        return { success: false, error: error.message };
      }

      console.log('ScanService: Fetched scan summary successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('ScanService: Unexpected error fetching scan summary:', error);
      return { success: false, error: error.message || 'Failed to fetch scan data' };
    }
  }
}
