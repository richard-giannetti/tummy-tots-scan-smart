
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ScanService, type ScanResult } from '@/services/scanService';
import { useGamification } from '@/hooks/useGamification';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const useEnhancedScanTracking = () => {
  const { user } = useAuth();
  const { awardPoints } = useGamification();
  const { trackScanPerformed } = useActivityTracking();

  const recordScan = async (scanResult?: ScanResult, barcode?: string) => {
    if (!user) {
      console.error('User not authenticated');
      toast({
        title: "Error",
        description: "You must be logged in to record scans",
        variant: "destructive",
      });
      return;
    }

    // Record the scan in the database
    const result = await ScanService.recordScan(user.id, scanResult, barcode);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to record scan data",
        variant: "destructive",
      });
      return;
    }

    // Track the scan activity
    await trackScanPerformed({
      barcode,
      productName: scanResult?.product?.productName,
      score: scanResult?.healthyTummiesScore
    });

    // Award gamification points for scanning
    await awardPoints('scan');

    console.log('Scan recorded and tracked successfully');
  };

  const generateMockScan = () => {
    return ScanService.generateMockScanResult();
  };

  return { recordScan, generateMockScan };
};
