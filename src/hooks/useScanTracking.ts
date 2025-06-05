
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ScanService } from '@/services/scanService';
import { useGamification } from '@/hooks/useGamification';

export const useScanTracking = () => {
  const { user } = useAuth();
  const { awardPoints } = useGamification();

  const recordScan = async (score?: number) => {
    if (!user) {
      console.error('User not authenticated');
      toast({
        title: "Error",
        description: "You must be logged in to record scans",
        variant: "destructive",
      });
      return;
    }

    const result = await ScanService.recordScan(user.id, score);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to record scan data",
        variant: "destructive",
      });
      return;
    }

    // Award gamification points for scanning
    await awardPoints('scan');

    console.log('Scan recorded successfully');
  };

  const generateMockScan = () => {
    return ScanService.generateMockScanResult();
  };

  return { recordScan, generateMockScan };
};
