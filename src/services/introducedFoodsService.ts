
import { supabase } from '@/integrations/supabase/client';

export interface IntroducedFood {
  id?: string;
  user_id?: string;
  baby_profile_id: string;
  food_id: string;
  introduced_date: string;
  notes?: string;
  created_at?: string;
}

export interface IntroducedFoodResponse {
  success: boolean;
  data?: IntroducedFood[];
  error?: string;
}

export interface FoodWithIntroduction {
  _id: string;
  name: string;
  Image: string;
  ageSuggestion: string;
  allergenInfo: string;
  chokingHazardInfo: string;
  commonAllergen: string;
  foodType: string;
  healthBenefits: string;
  introductionSummary: string;
  ironRich: string;
  servingSuggestion6Months: string;
  servingSuggestion12Months: string;
  servingSuggestion3Years: string;
  introduced?: boolean;
  introduced_date?: string;
}

export class IntroducedFoodsService {
  static async getIntroducedFoods(babyProfileId: string): Promise<IntroducedFoodResponse> {
    try {
      console.log('Fetching introduced foods for baby profile:', babyProfileId);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { data, error } = await supabase
        .from('introduced_foods')
        .select('*')
        .eq('baby_profile_id', babyProfileId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching introduced foods:', error);
        return { success: false, error: error.message };
      }

      console.log('Introduced foods fetched successfully:', data?.length || 0);
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Unexpected error fetching introduced foods:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async markFoodAsIntroduced(babyProfileId: string, foodId: string, notes?: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Marking food as introduced:', foodId, 'for baby:', babyProfileId);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { error } = await supabase
        .from('introduced_foods')
        .insert({
          user_id: user.id,
          baby_profile_id: babyProfileId,
          food_id: foodId,
          notes: notes || null,
          introduced_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error marking food as introduced:', error);
        return { success: false, error: error.message };
      }

      console.log('Food marked as introduced successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error marking food as introduced:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async markFoodsAsIntroduced(babyProfileId: string, foodIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Marking multiple foods as introduced:', foodIds.length, 'foods for baby:', babyProfileId);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const today = new Date().toISOString().split('T')[0];
      const insertData = foodIds.map(foodId => ({
        user_id: user.id,
        baby_profile_id: babyProfileId,
        food_id: foodId,
        introduced_date: today
      }));

      const { error } = await supabase
        .from('introduced_foods')
        .insert(insertData);

      if (error) {
        console.error('Error marking foods as introduced:', error);
        return { success: false, error: error.message };
      }

      console.log('Foods marked as introduced successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error marking foods as introduced:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async unmarkFoodAsIntroduced(babyProfileId: string, foodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Unmarking food as introduced:', foodId, 'for baby:', babyProfileId);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { error } = await supabase
        .from('introduced_foods')
        .delete()
        .eq('baby_profile_id', babyProfileId)
        .eq('food_id', foodId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unmarking food as introduced:', error);
        return { success: false, error: error.message };
      }

      console.log('Food unmarked as introduced successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error unmarking food as introduced:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  static async getAllFoodsWithIntroduction(babyProfileId: string): Promise<{ success: boolean; data?: FoodWithIntroduction[]; error?: string }> {
    try {
      console.log('Fetching all foods with introduction status for baby:', babyProfileId);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      // Get all foods
      const { data: foods, error: foodsError } = await supabase
        .from('foods')
        .select('*')
        .order('name');

      if (foodsError) {
        console.error('Error fetching foods:', foodsError);
        return { success: false, error: foodsError.message };
      }

      // Get introduced foods for this baby
      const { data: introducedFoods, error: introducedError } = await supabase
        .from('introduced_foods')
        .select('food_id, introduced_date')
        .eq('baby_profile_id', babyProfileId)
        .eq('user_id', user.id);

      if (introducedError) {
        console.error('Error fetching introduced foods:', introducedError);
        return { success: false, error: introducedError.message };
      }

      // Create a map for quick lookup
      const introducedMap = new Map(
        introducedFoods?.map(item => [item.food_id, item.introduced_date]) || []
      );

      // Combine the data
      const foodsWithIntroduction: FoodWithIntroduction[] = foods?.map(food => ({
        ...food,
        introduced: introducedMap.has(food._id),
        introduced_date: introducedMap.get(food._id)
      })) || [];

      console.log('Foods with introduction status fetched successfully:', foodsWithIntroduction.length);
      return { success: true, data: foodsWithIntroduction };
    } catch (error: any) {
      console.error('Unexpected error fetching foods with introduction status:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
