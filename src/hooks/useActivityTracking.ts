
import { useAuth } from '@/contexts/AuthContext';
import { UsageTrackingService } from '@/services/usageTrackingService';
import { useSessionTracking } from './useSessionTracking';

export const useActivityTracking = () => {
  const { user } = useAuth();
  const { trackAction } = useSessionTracking();

  const trackScanPerformed = async (scanData?: any) => {
    await trackAction('scan_performed', scanData);
  };

  const trackRecipeViewed = async (recipeId: string, recipeTitle?: string) => {
    await trackAction('recipe_viewed', { recipeId, recipeTitle });
  };

  const trackFoodIntroduced = async (foodId: string, foodName?: string) => {
    await trackAction('food_introduced', { foodId, foodName });
  };

  const trackSearchPerformed = async (searchQuery: string, resultsCount?: number) => {
    await trackAction('search_performed', { searchQuery, resultsCount });
  };

  const trackFoodDetailViewed = async (foodId: string, foodName?: string) => {
    await trackAction('food_detail_viewed', { foodId, foodName });
  };

  const trackTipViewed = async (tipId: string, tipTitle?: string) => {
    await trackAction('nutrition_tip_viewed', { tipId, tipTitle });
  };

  const trackProfileUpdated = async (updateType: string) => {
    await trackAction('profile_updated', { updateType });
  };

  const trackAchievementEarned = async (achievementId: string) => {
    await trackAction('achievement_earned', { achievementId });
  };

  return {
    trackScanPerformed,
    trackRecipeViewed,
    trackFoodIntroduced,
    trackSearchPerformed,
    trackFoodDetailViewed,
    trackTipViewed,
    trackProfileUpdated,
    trackAchievementEarned
  };
};
