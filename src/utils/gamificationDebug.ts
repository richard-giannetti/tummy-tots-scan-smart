
import { supabase } from '@/integrations/supabase/client';

export class GamificationDebug {
  /**
   * Reset user progress (for debugging purposes)
   */
  static async resetUserProgress(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          total_points: 0,
          feeding_level: 'Curious Parent',
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          achievements: [],
          level_progress: 0
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error resetting user progress:', error);
        return { success: false, error: error.message };
      }

      console.log('User progress reset successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error resetting progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get detailed user progress for debugging
   */
  static async getUserProgressDetails(userId: string) {
    try {
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: scanSummary, error: scanError } = await supabase
        .from('scan_summary')
        .select('*')
        .eq('user_id', userId)
        .order('scan_date', { ascending: false });

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
      }

      if (scanError && scanError.code !== 'PGRST116') {
        console.error('Error fetching scan summary:', scanError);
      }

      return {
        progress: progress || null,
        scanSummary: scanSummary || [],
        totalScans: scanSummary?.reduce((sum, day) => sum + (day.scan_count || 0), 0) || 0
      };
    } catch (error) {
      console.error('Error getting user progress details:', error);
      return null;
    }
  }
}
