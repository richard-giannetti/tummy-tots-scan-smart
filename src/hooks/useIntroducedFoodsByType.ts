
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
          
          // Group foods by type
          const typeGroups: { [key: string]: { introduced: number; total: number } } = {};
          
          foods.forEach(food => {
            const foodType = food.foodType || 'Other';
            if (!typeGroups[foodType]) {
              typeGroups[foodType] = { introduced: 0, total: 0 };
            }
            typeGroups[foodType].total++;
            if (food.introduced) {
              typeGroups[foodType].introduced++;
            }
          });

          // Convert to array and calculate percentages
          const progressData = Object.entries(typeGroups).map(([foodType, data]) => ({
            foodType,
            introduced: data.introduced,
            total: data.total,
            percentage: data.total > 0 ? (data.introduced / data.total) * 100 : 0
          }));

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
