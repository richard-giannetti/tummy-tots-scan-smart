
import { supabase } from '@/integrations/supabase/client';
import type { RecipeInteractionResponse } from './types';

export class RecipeInteractionsService {
  /**
   * Get count of tried recipes for current user
   */
  static async getTriedRecipesCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('recipe_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('tried', true);

      if (error) {
        console.error('RecipeInteractionsService: Error fetching tried recipes count:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: count || 0 };
    } catch (error: any) {
      console.error('RecipeInteractionsService: Unexpected error fetching tried recipes count:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Get recipe interaction for current user and specific recipe
   */
  static async getRecipeInteraction(recipeId: string): Promise<RecipeInteractionResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: interaction, error } = await supabase
        .from('recipe_interactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (error) {
        console.error('RecipeInteractionsService: Error fetching recipe interaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true, interaction };
    } catch (error: any) {
      console.error('RecipeInteractionsService: Unexpected error fetching recipe interaction:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Mark recipe as tried or untried
   */
  static async updateRecipeInteraction(recipeId: string, tried: boolean, rating?: number): Promise<RecipeInteractionResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const interactionData = {
        user_id: user.id,
        recipe_id: recipeId,
        tried,
        rating,
        tried_date: tried ? new Date().toISOString().split('T')[0] : null,
      };

      const { data: interaction, error } = await supabase
        .from('recipe_interactions')
        .upsert(interactionData, {
          onConflict: 'user_id,recipe_id'
        })
        .select()
        .single();

      if (error) {
        console.error('RecipeInteractionsService: Error updating recipe interaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true, interaction };
    } catch (error: any) {
      console.error('RecipeInteractionsService: Unexpected error updating recipe interaction:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
