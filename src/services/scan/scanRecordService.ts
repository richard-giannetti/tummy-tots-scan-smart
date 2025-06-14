
import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from './types';

export class ScanRecordService {
  static async recordScan(userId: string, scanResult?: ScanResult, barcode?: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Recording scan for user:', userId);
      
      if (!scanResult) {
        console.warn('No scan result provided');
        return { success: false, error: 'No scan result provided' };
      }

      // Call the Supabase function to update scan tracking
      const { error } = await supabase.rpc('update_scan_tracking', {
        user_uuid: userId,
        scan_score: scanResult.healthyTummiesScore,
        product_barcode: barcode,
        product_name_param: scanResult.product.productName,
        brand_param: scanResult.product.brand,
        nutri_score_param: scanResult.nutriscore,
        nova_score_param: scanResult.novaGroup,
        eco_score_param: scanResult.ecoscore,
        nutritional_data_param: JSON.stringify(scanResult.product.nutritionalInfo),
        ingredients_param: scanResult.product.ingredients.join(', '),
        image_urls_param: JSON.stringify([scanResult.product.imageUrl])
      });

      if (error) {
        console.error('Error recording scan:', error);
        return { success: false, error: error.message };
      }

      console.log('Scan recorded successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error recording scan:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
