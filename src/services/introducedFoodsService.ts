
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

export interface PaginatedFoodsResponse {
  success: boolean;
  data?: FoodWithIntroduction[];
  totalCount?: number;
  error?: string;
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

  static async getPaginatedFoodsWithIntroduction(
    babyProfileId: string, 
    page: number = 1, 
    limit: number = 25,
    searchTerm?: string,
    filterType?: 'all' | 'introduced' | 'not-introduced'
  ): Promise<PaginatedFoodsResponse> {
    try {
      console.log('=== DEBUGGING FOODS ACCESS ===');
      console.log('Fetching paginated foods for baby:', babyProfileId, 'page:', page, 'limit:', limit);
      
      // Check authentication first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (userError || !user) {
        console.error('No authenticated user found:', userError);
        return { success: false, error: 'No authenticated user found' };
      }

      const offset = (page - 1) * limit;

      // Test 1: Basic table access without any filters
      console.log('TEST 1: Basic access to foods table...');
      const { data: basicTest, error: basicError, count: basicCount } = await supabase
        .from('foods')
        .select('_id, name', { count: 'exact' })
        .limit(5);

      console.log('Basic test result:', {
        count: basicCount,
        dataLength: basicTest?.length,
        error: basicError,
        sampleData: basicTest?.slice(0, 2)
      });

      // Test 2: Try with different select patterns
      console.log('TEST 2: Testing with * select...');
      const { data: starTest, error: starError } = await supabase
        .from('foods')
        .select('*')
        .limit(3);

      console.log('Star select test:', {
        dataLength: starTest?.length,
        error: starError,
        sampleData: starTest?.slice(0, 1)
      });

      // Test 3: Check if RLS is blocking
      console.log('TEST 3: Checking RLS policies...');
      const { data: rpcTest, error: rpcError } = await supabase.rpc('get_foods_count');
      console.log('RPC test (if function exists):', { data: rpcTest, error: rpcError });

      // Use the basic test result if it worked
      if (basicError) {
        console.error('Error accessing foods table:', basicError);
        return { success: false, error: `Cannot access foods table: ${basicError.message}` };
      }

      if (!basicTest || basicTest.length === 0) {
        console.log('Foods table appears to be empty or inaccessible');
        console.log('Trying alternative approach...');
        
        // Test 4: Try without count to see if that's the issue
        const { data: noCountTest, error: noCountError } = await supabase
          .from('foods')
          .select('_id, name')
          .limit(10);
          
        console.log('No count test:', {
          dataLength: noCountTest?.length,
          error: noCountError,
          data: noCountTest
        });
        
        if (noCountError) {
          return { success: false, error: `Foods table access failed: ${noCountError.message}` };
        }
        
        if (!noCountTest || noCountTest.length === 0) {
          return { success: true, data: [], totalCount: 0 };
        }
      }

      // If we get here, we have access - proceed with the full query
      console.log('SUCCESS: Table is accessible, proceeding with full query...');

      // Build query for foods with proper pagination
      let foodsQuery = supabase
        .from('foods')
        .select('*', { count: 'exact' })
        .order('name');

      // Add search filter if provided
      if (searchTerm) {
        console.log('Applying search term:', searchTerm);
        foodsQuery = foodsQuery.or(`name.ilike.%${searchTerm}%,foodType.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      foodsQuery = foodsQuery.range(offset, offset + limit - 1);

      const { data: foods, error: foodsError, count } = await foodsQuery;

      console.log('Main query result:', {
        count,
        dataLength: foods?.length,
        error: foodsError,
        offset,
        limit
      });

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

      console.log('Introduced foods count:', introducedFoods?.length || 0);

      // Create a map for quick lookup
      const introducedMap = new Map(
        introducedFoods?.map(item => [item.food_id, item.introduced_date]) || []
      );

      // Combine the data
      let foodsWithIntroduction: FoodWithIntroduction[] = foods?.map(food => ({
        ...food,
        introduced: introducedMap.has(food._id),
        introduced_date: introducedMap.get(food._id)
      })) || [];

      // Apply introduction status filter if provided
      if (filterType === 'introduced') {
        foodsWithIntroduction = foodsWithIntroduction.filter(food => food.introduced);
      } else if (filterType === 'not-introduced') {
        foodsWithIntroduction = foodsWithIntroduction.filter(food => !food.introduced);
      }

      console.log('Final result - foods with introduction status:', foodsWithIntroduction.length);
      console.log('Sample foods:', foodsWithIntroduction.slice(0, 3).map(f => ({ id: f._id, name: f.name })));
      console.log('=== END DEBUGGING ===');
      
      return { 
        success: true, 
        data: foodsWithIntroduction,
        totalCount: count || 0
      };
    } catch (error: any) {
      console.error('Unexpected error fetching paginated foods:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
