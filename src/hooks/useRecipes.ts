
import { useQuery } from '@tanstack/react-query';
import { RecipesService } from '@/services/recipes';

export const useRecipes = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['recipes', page, limit],
    queryFn: () => RecipesService.getRecipes(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};

export const useSearchRecipes = (query: string) => {
  return useQuery({
    queryKey: ['recipes', 'search', query],
    queryFn: () => RecipesService.searchRecipes(query),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFavoriteRecipes = () => {
  return useQuery({
    queryKey: ['recipes', 'favorites'],
    queryFn: () => RecipesService.getFavoriteRecipes(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useRecipeInteraction = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe-interaction', recipeId],
    queryFn: () => RecipesService.getRecipeInteraction(recipeId),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useRecipeFavoriteStatus = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe-favorite', recipeId],
    queryFn: () => RecipesService.isRecipeFavorited(recipeId),
    staleTime: 30 * 1000, // 30 seconds
  });
};
