
import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  id?: string;
  user_id: string;
  total_points: number;
  feeding_level: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  achievements: string[];
  level_progress: number;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface ProgressResponse {
  success: boolean;
  progress?: UserProgress;
  error?: string;
}

export interface AchievementResponse {
  success: boolean;
  newAchievements?: Achievement[];
  error?: string;
}

const FEEDING_LEVELS = [
  { name: 'Curious Parent', minPoints: 0, maxPoints: 199 },
  { name: 'Informed Feeder', minPoints: 200, maxPoints: 499 },
  { name: 'Nutrition Navigator', minPoints: 500, maxPoints: 999 },
  { name: 'Feeding Expert', minPoints: 1000, maxPoints: 1999 },
  { name: 'Baby Food Master', minPoints: 2000, maxPoints: Infinity }
];

const ACHIEVEMENTS: Achievement[] = [
  // Scanning Achievements
  {
    id: 'first_scan',
    name: 'First Scan',
    description: 'Complete your first barcode scan',
    icon: '🔍',
    points: 25,
    category: 'scanning'
  },
  {
    id: 'safety_scanner',
    name: 'Safety Scanner',
    description: 'Scan 10 products in one week',
    icon: '🛡️',
    points: 100,
    category: 'scanning'
  },
  {
    id: 'label_detective',
    name: 'Label Detective',
    description: 'Scan 50 different products',
    icon: '🕵️',
    points: 200,
    category: 'scanning'
  },
  {
    id: 'grocery_guru',
    name: 'Grocery Guru',
    description: 'Maintain 7-day scanning streak',
    icon: '🛒',
    points: 150,
    category: 'scanning'
  },
  
  // Feeding Journey Badges
  {
    id: 'blw_beginner',
    name: 'BLW Beginner',
    description: 'Try your first app recipe',
    icon: '👶',
    points: 30,
    category: 'feeding'
  },
  {
    id: 'flavor_explorer',
    name: 'Flavor Explorer',
    description: 'Introduce 10 new foods to baby',
    icon: '🌈',
    points: 200,
    category: 'feeding'
  },
  {
    id: 'variety_champion',
    name: 'Variety Champion',
    description: 'Try 5 recipes',
    icon: '🏆',
    points: 150,
    category: 'feeding'
  },
  {
    id: 'nutrition_ninja',
    name: 'Nutrition Ninja',
    description: 'Try 10 recipes',
    icon: '🥷',
    points: 300,
    category: 'feeding'
  },
  {
    id: 'consistent_carer',
    name: 'Consistent Carer',
    description: 'Maintain 30-day scanning streak',
    icon: '💚',
    points: 500,
    category: 'consistency'
  }
];

export class GamificationService {
  /**
   * Initialize user progress
   */
  static async initializeUserProgress(userId: string): Promise<ProgressResponse> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          total_points: 0,
          feeding_level: 'Curious Parent',
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          achievements: [],
          level_progress: 0
        })
        .select()
        .single();

      if (error) {
        console.error('GamificationService: Error initializing progress:', error);
        return { success: false, error: error.message };
      }

      return { success: true, progress: data };
    } catch (error: any) {
      console.error('GamificationService: Unexpected error initializing progress:', error);
      return { success: false, error: error.message || 'Failed to initialize progress' };
    }
  }

  /**
   * Get user progress
   */
  static async getUserProgress(userId: string): Promise<ProgressResponse> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No progress found, initialize it
          return await this.initializeUserProgress(userId);
        }
        console.error('GamificationService: Error fetching progress:', error);
        return { success: false, error: error.message };
      }

      return { success: true, progress: data };
    } catch (error: any) {
      console.error('GamificationService: Unexpected error fetching progress:', error);
      return { success: false, error: error.message || 'Failed to fetch progress' };
    }
  }

  /**
   * Award points for specific actions
   */
  static async awardPoints(
    userId: string, 
    action: string, 
    points: number,
    checkAchievements = true
  ): Promise<AchievementResponse> {
    try {
      const progressResult = await this.getUserProgress(userId);
      if (!progressResult.success || !progressResult.progress) {
        return { success: false, error: 'Failed to get user progress' };
      }

      const currentProgress = progressResult.progress;
      const newTotalPoints = currentProgress.total_points + points;
      const newLevel = this._calculateLevel(newTotalPoints);
      const levelProgress = this._calculateLevelProgress(newTotalPoints);

      // Update streak if applicable
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = new Date(currentProgress.last_activity_date);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = currentProgress.current_streak;
      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }

      const longestStreak = Math.max(currentProgress.longest_streak, newStreak);

      // Update progress
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          total_points: newTotalPoints,
          feeding_level: newLevel.name,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          level_progress: levelProgress
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('GamificationService: Error updating progress:', updateError);
        return { success: false, error: updateError.message };
      }

      // Check for new achievements
      let newAchievements: Achievement[] = [];
      if (checkAchievements) {
        const achievementResult = await this._checkForNewAchievements(userId, action, newTotalPoints, newStreak);
        if (achievementResult.success && achievementResult.newAchievements) {
          newAchievements = achievementResult.newAchievements;
        }
      }

      return { success: true, newAchievements };
    } catch (error: any) {
      console.error('GamificationService: Unexpected error awarding points:', error);
      return { success: false, error: error.message || 'Failed to award points' };
    }
  }

  /**
   * Get available achievements for user
   */
  static async getUserAchievements(userId: string): Promise<{ success: boolean; achievements?: Achievement[]; error?: string }> {
    try {
      const progressResult = await this.getUserProgress(userId);
      if (!progressResult.success || !progressResult.progress) {
        return { success: false, error: 'Failed to get user progress' };
      }

      const unlockedAchievements = progressResult.progress.achievements || [];
      
      const achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: unlockedAchievements.includes(achievement.id)
      }));

      return { success: true, achievements: achievementsWithStatus };
    } catch (error: any) {
      console.error('GamificationService: Error fetching achievements:', error);
      return { success: false, error: error.message || 'Failed to fetch achievements' };
    }
  }

  /**
   * Check for profile completion points
   */
  static async checkProfileCompletion(userId: string): Promise<AchievementResponse> {
    return await this.awardPoints(userId, 'profile_completion', 50);
  }

  /**
   * Award points for scanning
   */
  static async awardScanPoints(userId: string): Promise<AchievementResponse> {
    return await this.awardPoints(userId, 'scan_performed', 10);
  }

  /**
   * Award points for trying a recipe
   */
  static async awardRecipePoints(userId: string): Promise<AchievementResponse> {
    return await this.awardPoints(userId, 'recipe_tried', 30);
  }

  /**
   * Award points for introducing new food
   */
  static async awardNewFoodPoints(userId: string): Promise<AchievementResponse> {
    return await this.awardPoints(userId, 'food_introduced', 40);
  }

  // Private helper methods
  private static _calculateLevel(points: number) {
    return FEEDING_LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || FEEDING_LEVELS[0];
  }

  private static _calculateLevelProgress(points: number): number {
    const currentLevel = this._calculateLevel(points);
    if (currentLevel.maxPoints === Infinity) return 100;
    
    const levelPoints = points - currentLevel.minPoints;
    const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
    return Math.min(100, Math.round((levelPoints / levelRange) * 100));
  }

  private static async _checkForNewAchievements(
    userId: string, 
    action: string, 
    totalPoints: number, 
    currentStreak: number
  ): Promise<AchievementResponse> {
    try {
      const progressResult = await this.getUserProgress(userId);
      if (!progressResult.success || !progressResult.progress) {
        return { success: false, error: 'Failed to get progress for achievements' };
      }

      const unlockedAchievements = progressResult.progress.achievements || [];
      const newAchievements: Achievement[] = [];

      // Check each achievement condition
      for (const achievement of ACHIEVEMENTS) {
        if (unlockedAchievements.includes(achievement.id)) continue;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_scan':
            shouldUnlock = action === 'scan_performed';
            break;
          case 'blw_beginner':
            shouldUnlock = action === 'recipe_tried';
            break;
          case 'grocery_guru':
            shouldUnlock = currentStreak >= 7;
            break;
          case 'consistent_carer':
            shouldUnlock = currentStreak >= 30;
            break;
          // Add more achievement conditions as needed
        }

        if (shouldUnlock) {
          newAchievements.push(achievement);
          unlockedAchievements.push(achievement.id);
        }
      }

      // Update achievements in database
      if (newAchievements.length > 0) {
        const { error } = await supabase
          .from('user_progress')
          .update({ achievements: unlockedAchievements })
          .eq('user_id', userId);

        if (error) {
          console.error('GamificationService: Error updating achievements:', error);
          return { success: false, error: error.message };
        }
      }

      return { success: true, newAchievements };
    } catch (error: any) {
      console.error('GamificationService: Error checking achievements:', error);
      return { success: false, error: error.message || 'Failed to check achievements' };
    }
  }

  static getFeedingLevels() {
    return FEEDING_LEVELS;
  }

  static getAllAchievements() {
    return ACHIEVEMENTS;
  }
}
