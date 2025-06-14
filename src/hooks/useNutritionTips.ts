
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Tip {
  tip_id: number;
  tip_title: string;
  tip_description: string;
  tip_age: string;
}

export const useNutritionTips = () => {
  const { user } = useAuth();
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readTips, setReadTips] = useState<Set<number>>(new Set());
  const [availableTips, setAvailableTips] = useState<Tip[]>([]);

  // Fetch tips from database
  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching tips from Supabase...');
        
        const { data: tips, error } = await supabase
          .from('tips')
          .select('tip_id, tip_title, tip_description, tip_age')
          .order('tip_id');

        console.log('Tips query result:', { tips, error });

        if (error) {
          console.error('Error fetching tips:', error);
          setIsLoading(false);
          return;
        }

        if (tips && tips.length > 0) {
          console.log(`Successfully fetched ${tips.length} tips`);
          setAvailableTips(tips);

          // Load read tips from localStorage
          const savedReadTips = localStorage.getItem(`readTips_${user?.id}`);
          const readTipIds = savedReadTips 
            ? new Set<number>(JSON.parse(savedReadTips) as number[]) 
            : new Set<number>();
          setReadTips(readTipIds);

          // Find unread tips
          const unreadTips = tips.filter(tip => !readTipIds.has(tip.tip_id));
          
          if (unreadTips.length > 0) {
            const randomTip = unreadTips[Math.floor(Math.random() * unreadTips.length)];
            setCurrentTip(randomTip);
          } else {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            setCurrentTip(randomTip);
          }
        } else {
          console.log('No tips found in database');
        }

      } catch (error) {
        console.error('Error in fetchTips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTips();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Mark tip as read
  const markAsRead = () => {
    if (!currentTip || !user) return;

    const newReadTips = new Set(readTips);
    newReadTips.add(currentTip.tip_id);
    setReadTips(newReadTips);
    
    // Save to localStorage
    localStorage.setItem(`readTips_${user.id}`, JSON.stringify([...newReadTips]));

    // Get next unread tip
    const unreadTips = availableTips.filter(tip => !newReadTips.has(tip.tip_id));
    if (unreadTips.length > 0) {
      const randomTip = unreadTips[Math.floor(Math.random() * unreadTips.length)];
      setCurrentTip(randomTip);
    }
  };

  // Get new tip
  const getNewTip = () => {
    if (availableTips.length <= 1) return;
    
    const otherTips = availableTips.filter(tip => tip.tip_id !== currentTip?.tip_id);
    const randomTip = otherTips[Math.floor(Math.random() * otherTips.length)];
    setCurrentTip(randomTip);
  };

  return {
    currentTip,
    isLoading,
    availableTips,
    markAsRead,
    getNewTip,
    user
  };
};
