
import { supabase } from '@/integrations/supabase/client';
import type { RecipeResponse, RecipeFavoriteResponse } from './types';

export class RecipeFavoritesService {
  /**
   * Get favorite recipes for current user
   */
  static async getFavoriteRecipes(): Promise<RecipeResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: favorites, error } = await supabase
        .from('recipe_favorites')
        .select(`
          recipe_id,
          recipes!fk_recipe_favorites_recipe_id (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('RecipeFavoritesService: Error fetching favorite recipes:', error);
        return { success: false, error: error.message };
      }

      const recipes = favorites?.map(fav => (fav as any).recipes).filter(recipe => recipe) || [];
      return { success: true, recipes };
    } catch (error: any) {
      console.error('RecipeFavoritesService: Unexpected error fetching favorite recipes:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Check if a recipe is favorited by current user
   */
  static async isRecipeFavorited(recipeId: string): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: favorite, error } = await supabase
        .from('recipe_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (error) {
        console.error('RecipeFavoritesService: Error checking recipe favorite:', error);
        return { success: false, error: error.message };
      }

      return { success: true, isFavorited: !!favorite };
    } catch (error: any) {
      console.error('RecipeFavoritesService: Unexpected error checking recipe favorite:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Add or remove recipe from favorites
   */
  static async toggleRecipeFavorite(recipeId: string): Promise<RecipeFavoriteResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // First check if it's already favorited
      const { data: existingFavorite, error: checkError } = await supabase
        .from('recipe_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (checkError) {
        console.error('RecipeFavoritesService: Error checking existing favorite:', checkError);
        return { success: false, error: checkError.message };
      }

      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('recipe_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (deleteError) {
          console.error('RecipeFavoritesService: Error removing favorite:', deleteError);
          return { success: false, error: deleteError.message };
        }

        return { success: true };
      } else {
        // Add to favorites
        const { data: favorite, error: insertError } = await supabase
          .from('recipe_favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipeId
          })
          .select()
          .single();

        if (insertError) {
          console.error('RecipeFavoritesService: Error adding favorite:', insertError);
          return { success: false, error: insertError.message };
        }

        return { success: true, favorite };
      }
    } catch (error: any) {
      console.error('RecipeFavoritesService: Unexpected error toggling recipe favorite:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
