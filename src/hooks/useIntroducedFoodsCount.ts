
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IntroducedFoodsService } from '@/services/introducedFoodsService';
import { BabyProfileService } from '@/services/babyProfileService';

export const useIntroducedFoodsCount = () => {
  const { user } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      if (!user) {
        setCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First get the baby profile to get the ID
        const profileResult = await BabyProfileService.getBabyProfile();
        
        if (!profileResult.success || !profileResult.profile) {
          setCount(0);
          setLoading(false);
          return;
        }

        const result = await IntroducedFoodsService.getIntroducedFoods(profileResult.profile.id);
        
        if (result.success && result.data) {
          setCount(result.data.length);
        } else {
          setCount(0);
        }
      } catch (error) {
        console.error('Error fetching introduced foods count:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [user]);

  return { count, loading };
};
