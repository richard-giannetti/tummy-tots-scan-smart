
import { RecipesCoreService } from './recipesCore';
import { RecipeInteractionsService } from './recipeInteractions';
import { RecipeFavoritesService } from './recipeFavorites';

export * from './types';

export class RecipesService {
  // Core recipe methods
  static getRecipes = RecipesCoreService.getRecipes;
  static searchRecipes = RecipesCoreService.searchRecipes;
  static getRecipeById = RecipesCoreService.getRecipeById;

  // Recipe interaction methods
  static getTriedRecipesCount = RecipeInteractionsService.getTriedRecipesCount;
  static getRecipeInteraction = RecipeInteractionsService.getRecipeInteraction;
  static updateRecipeInteraction = RecipeInteractionsService.updateRecipeInteraction;

  // Recipe favorites methods
  static getFavoriteRecipes = RecipeFavoritesService.getFavoriteRecipes;
  static isRecipeFavorited = RecipeFavoritesService.isRecipeFavorited;
  static toggleRecipeFavorite = RecipeFavoritesService.toggleRecipeFavorite;
}
