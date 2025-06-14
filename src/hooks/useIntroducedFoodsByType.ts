
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IntroducedFoodsService } from '@/services/introducedFoodsService';
import { BabyProfileService } from '@/services/babyProfileService';

interface FoodTypeProgress {
  foodType: string;
  introduced: number;
  total: number;
  percentage: number;
}

const MAIN_FOOD_TYPES = ['Fruit', 'Vegetable', 'Dairy', 'Meat'];

const categorizeFoodType = (foodType: string | null | undefined): string => {
  if (!foodType) return 'Other types';
  
  const normalizedType = foodType.toLowerCase().trim();
  
  // Check for exact matches first
  for (const mainType of MAIN_FOOD_TYPES) {
    if (normalizedType === mainType.toLowerCase()) {
      return mainType;
    }
  }
  
  // Check for partial matches or variations
  if (normalizedType.includes('fruit') || normalizedType.includes('berry')) {
    return 'Fruit';
  }
  if (normalizedType.includes('vegetable') || normalizedType.includes('veggie')) {
    return 'Vegetable';
  }
  if (normalizedType.includes('dairy') || normalizedType.includes('milk') || normalizedType.includes('cheese') || normalizedType.includes('yogurt')) {
    return 'Dairy';
  }
  if (normalizedType.includes('meat') || normalizedType.includes('protein') || normalizedType.includes('chicken') || normalizedType.includes('beef') || normalizedType.includes('fish')) {
    return 'Meat';
  }
  
  return 'Other types';
};

export const useIntroducedFoodsByType = () => {
  const { user } = useAuth();
  const [progressByType, setProgressByType] = useState<FoodTypeProgress[]>([]);
  const [totalIntroduced, setTotalIntroduced] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressByType = async () => {
      if (!user) {
        setProgressByType([]);
        setTotalIntroduced(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First get the baby profile to get the ID
        const profileResult = await BabyProfileService.getBabyProfile();
        
        if (!profileResult.success || !profileResult.profile) {
          setProgressByType([]);
          setTotalIntroduced(0);
          setLoading(false);
          return;
        }

        const result = await IntroducedFoodsService.getAllFoodsWithIntroduction(profileResult.profile.id);
        
        if (result.success && result.data) {
          const foods = result.data;
          
          // Group foods by categorized type
          const typeGroups: { [key: string]: { introduced: number; total: number } } = {};
          
          foods.forEach(food => {
            const categorizedType = categorizeFoodType(food.foodType);
            if (!typeGroups[categorizedType]) {
              typeGroups[categorizedType] = { introduced: 0, total: 0 };
            }
            typeGroups[categorizedType].total++;
            if (food.introduced) {
              typeGroups[categorizedType].introduced++;
            }
          });

          // Convert to array and calculate percentages, ensuring all main types are included
          const allTypes = [...MAIN_FOOD_TYPES, 'Other types'];
          const progressData = allTypes.map(foodType => {
            const data = typeGroups[foodType] || { introduced: 0, total: 0 };
            return {
              foodType,
              introduced: data.introduced,
              total: data.total,
              percentage: data.total > 0 ? (data.introduced / data.total) * 100 : 0
            };
          }).filter(item => item.total > 0); // Only show types that have foods

          // Sort by percentage descending, then by total count descending
          progressData.sort((a, b) => {
            if (b.percentage !== a.percentage) {
              return b.percentage - a.percentage;
            }
            return b.total - a.total;
          });

          setProgressByType(progressData);
          setTotalIntroduced(foods.filter(food => food.introduced).length);
        } else {
          setProgressByType([]);
          setTotalIntroduced(0);
        }
      } catch (error) {
        console.error('Error fetching food progress by type:', error);
        setProgressByType([]);
        setTotalIntroduced(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressByType();
  }, [user]);

  return { progressByType, totalIntroduced, loading };
};
