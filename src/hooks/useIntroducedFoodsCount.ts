
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IntroducedFoodsService } from '@/services/introducedFoodsService';

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
        const result = await IntroducedFoodsService.getIntroducedFoods();
        
        if (result.success && result.introducedFoods) {
          setCount(result.introducedFoods.length);
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
