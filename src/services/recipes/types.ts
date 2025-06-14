
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

export interface RecipeFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
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

export interface RecipeFavoriteResponse {
  success: boolean;
  favorite?: RecipeFavorite;
  error?: string;
}
