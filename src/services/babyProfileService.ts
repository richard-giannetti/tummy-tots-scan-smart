
import { supabase } from '@/integrations/supabase/client';

export interface BabyProfile {
  id?: string;
  user_id?: string;
  name: string;
  birth_date: string;
  allergies: string[];
  dietary_restrictions: string[];
  created_at?: string;
}

export interface BabyProfileResponse {
  success: boolean;
  profile?: BabyProfile;
  error?: string;
}

/**
 * Service for managing baby profiles
 */
export class BabyProfileService {
  /**
   * Get the current user's baby profile
   */
  static async getBabyProfile(): Promise<BabyProfileResponse> {
    try {
      console.log('BabyProfileService: Fetching baby profile');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('BabyProfileService: No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { data: profile, error } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this is normal for new users
          console.log('BabyProfileService: No baby profile found for user');
          return { success: true, profile: undefined };
        }
        console.error('BabyProfileService: Error fetching baby profile:', error);
        return { success: false, error: error.message };
      }

      console.log('BabyProfileService: Baby profile fetched successfully');
      return { success: true, profile };
    } catch (error: any) {
      console.error('BabyProfileService: Unexpected error fetching baby profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Create or update the current user's baby profile
   */
  static async saveBabyProfile(profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>): Promise<BabyProfileResponse> {
    try {
      console.log('BabyProfileService: Saving baby profile');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('BabyProfileService: No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      // Try to update existing profile first, then insert if none exists
      const { data: profile, error } = await supabase
        .from('baby_profiles')
        .upsert({
          user_id: user.id,
          name: profileData.name,
          birth_date: profileData.birth_date,
          allergies: profileData.allergies,
          dietary_restrictions: profileData.dietary_restrictions
        })
        .select()
        .single();

      if (error) {
        console.error('BabyProfileService: Error saving baby profile:', error);
        return { success: false, error: error.message };
      }

      console.log('BabyProfileService: Baby profile saved successfully');
      return { success: true, profile };
    } catch (error: any) {
      console.error('BabyProfileService: Unexpected error saving baby profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Delete the current user's baby profile
   */
  static async deleteBabyProfile(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('BabyProfileService: Deleting baby profile');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('BabyProfileService: No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { error } = await supabase
        .from('baby_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('BabyProfileService: Error deleting baby profile:', error);
        return { success: false, error: error.message };
      }

      console.log('BabyProfileService: Baby profile deleted successfully');
      return { success: true };
    } catch (error: any) {
      console.error('BabyProfileService: Unexpected error deleting baby profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
