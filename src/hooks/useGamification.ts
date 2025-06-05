
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationService, UserProgress, Achievement } from '@/services/gamificationService';
import { toast } from '@/hooks/use-toast';

export const useGamification = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    try {
      const result = await GamificationService.getUserProgress(user.id);
      if (result.success && result.progress) {
        setProgress(result.progress);
      } else {
        console.error('Failed to fetch user progress:', result.error);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const result = await GamificationService.getUserAchievements(user.id);
      if (result.success && result.achievements) {
        setAchievements(result.achievements);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
    fetchAchievements();
  }, [fetchProgress, fetchAchievements]);

  const awardPoints = async (action: 'scan' | 'recipe' | 'newFood' | 'profile') => {
    if (!user) return;

    try {
      let result;
      switch (action) {
        case 'scan':
          result = await GamificationService.awardScanPoints(user.id);
          break;
        case 'recipe':
          result = await GamificationService.awardRecipePoints(user.id);
          break;
        case 'newFood':
          result = await GamificationService.awardNewFoodPoints(user.id);
          break;
        case 'profile':
          result = await GamificationService.checkProfileCompletion(user.id);
          break;
        default:
          return;
      }

      if (result.success) {
        // Refresh progress
        await fetchProgress();
        
        // Show new achievements
        if (result.newAchievements && result.newAchievements.length > 0) {
          setNewAchievements(result.newAchievements);
          await fetchAchievements();
        }
      } else {
        console.error('Failed to award points:', result.error);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const dismissAchievement = (achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  return {
    progress,
    achievements,
    newAchievements,
    loading,
    awardPoints,
    dismissAchievement,
    clearNewAchievements,
    refetch: fetchProgress
  };
};
