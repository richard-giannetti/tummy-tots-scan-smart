
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useScanTracking = () => {
  const { user } = useAuth();

  const recordScan = async (score?: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase.rpc('update_scan_tracking', {
        user_uuid: user.id,
        scan_score: score || null
      });

      if (error) {
        console.error('Error recording scan:', error);
        throw error;
      }

      console.log('Scan recorded successfully');
    } catch (error: any) {
      console.error('Failed to record scan:', error);
      toast({
        title: "Error",
        description: "Failed to record scan data",
        variant: "destructive",
      });
    }
  };

  return { recordScan };
};
