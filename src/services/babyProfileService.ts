
import { supabase } from '@/integrations/supabase/client';

export interface BabyProfile {
  id?: string;
  user_id?: string;
  name: string;
  birth_date: string;
  weight_kg?: number;
  feeding_stage?: 'exclusive_milk' | 'introducing_solids' | 'mixed_feeding' | 'toddler_food';
  allergies: string[];
  dietary_restrictions: string[];
  dietary_preferences: string[];
  health_conditions: string[];
  feeding_goals: string[];
  feeding_type?: string;
  medical_conditions?: string[];
  avatar_url?: string;
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

      // Transform database response to match our interface
      const transformedProfile: BabyProfile = {
        id: profile.id,
        user_id: profile.user_id,
        name: profile.name,
        birth_date: profile.birth_date,
        weight_kg: profile.weight_kg,
        feeding_stage: profile.feeding_stage as BabyProfile['feeding_stage'],
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || [],
        dietary_preferences: profile.dietary_preferences || [],
        health_conditions: profile.health_conditions || [],
        feeding_goals: profile.feeding_goals || [],
        feeding_type: profile.feeding_type,
        medical_conditions: profile.medical_conditions || [],
        avatar_url: profile.avatar_url,
        created_at: profile.created_at
      };

      console.log('BabyProfileService: Baby profile fetched successfully');
      return { success: true, profile: transformedProfile };
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
          weight_kg: profileData.weight_kg,
          feeding_stage: profileData.feeding_stage,
          allergies: profileData.allergies,
          dietary_restrictions: profileData.dietary_restrictions,
          dietary_preferences: profileData.dietary_preferences,
          health_conditions: profileData.health_conditions,
          feeding_goals: profileData.feeding_goals,
          feeding_type: profileData.feeding_type,
          medical_conditions: profileData.medical_conditions,
          avatar_url: profileData.avatar_url
        })
        .select()
        .single();

      if (error) {
        console.error('BabyProfileService: Error saving baby profile:', error);
        return { success: false, error: error.message };
      }

      // Transform database response to match our interface
      const transformedProfile: BabyProfile = {
        id: profile.id,
        user_id: profile.user_id,
        name: profile.name,
        birth_date: profile.birth_date,
        weight_kg: profile.weight_kg,
        feeding_stage: profile.feeding_stage as BabyProfile['feeding_stage'],
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || [],
        dietary_preferences: profile.dietary_preferences || [],
        health_conditions: profile.health_conditions || [],
        feeding_goals: profile.feeding_goals || [],
        feeding_type: profile.feeding_type,
        medical_conditions: profile.medical_conditions || [],
        avatar_url: profile.avatar_url,
        created_at: profile.created_at
      };

      console.log('BabyProfileService: Baby profile saved successfully');
      return { success: true, profile: transformedProfile };
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
