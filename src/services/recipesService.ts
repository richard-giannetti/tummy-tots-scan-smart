
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  servings: number;
  ingredients: Json;
  method: Json;
  link: string;
  time: string;
}

export interface RecipeInteraction {
  id?: string;
  user_id?: string;
  baby_profile_id?: string;
  recipe_id: string;
  tried: boolean;
  rating?: number;
  tried_date?: string;
  created_at?: string;
}

export interface RecipeResponse {
  success: boolean;
  recipes?: Recipe[];
  error?: string;
}

export interface RecipeInteractionResponse {
  success: boolean;
  interaction?: RecipeInteraction;
  error?: string;
}

export class RecipesService {
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
        console.error('RecipesService: Error fetching recipes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipes: recipes || [] };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error fetching recipes:', error);
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
        console.error('RecipesService: Error searching recipes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipes: recipes || [] };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error searching recipes:', error);
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
        console.error('RecipesService: Error fetching recipe:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recipe };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error fetching recipe:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

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
        console.error('RecipesService: Error fetching tried recipes count:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: count || 0 };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error fetching tried recipes count:', error);
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
        console.error('RecipesService: Error fetching recipe interaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true, interaction };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error fetching recipe interaction:', error);
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
        console.error('RecipesService: Error updating recipe interaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true, interaction };
    } catch (error: any) {
      console.error('RecipesService: Unexpected error updating recipe interaction:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
