
import { supabase } from '@/integrations/supabase/client';
import type { Recipe, RecipeResponse } from './types';

export class RecipesCoreService {
  /**
   * Get all recipes with pagination
   */
  static async getRecipes(page = 1, limit = 20): Promise<RecipeResponse> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: recipes, error } = await supabase
        .from('recipes')
        .select('*')
        .range(from, to)
        .order('title');

      if (error) {
        console.error('RecipesCoreService: Error fetching recipes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipes: recipes || [] };
    } catch (error: any) {
      console.error('RecipesCoreService: Unexpected error fetching recipes:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Search recipes by query
   */
  static async searchRecipes(query: string): Promise<RecipeResponse> {
    try {
      const { data: recipes, error } = await supabase
        .from('recipes')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('title');

      if (error) {
        console.error('RecipesCoreService: Error searching recipes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipes: recipes || [] };
    } catch (error: any) {
      console.error('RecipesCoreService: Unexpected error searching recipes:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string): Promise<{ success: boolean; recipe?: Recipe; error?: string }> {
    try {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('_id', id)
        .single();

      if (error) {
        console.error('RecipesCoreService: Error fetching recipe:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipe };
    } catch (error: any) {
      console.error('RecipesCoreService: Unexpected error fetching recipe:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
