import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
interface ScanSummary {
  id: string;
  scan_date: string;
  average_score: number;
  product_name: string;
  brand: string;
  barcode: string;
  image_urls: any; // Changed from string[] to any to handle Json type from database
}
export const RecentScans = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchRecentScans();
    }
  }, [user]);
  const fetchRecentScans = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('scan_summary').select('*').eq('user_id', user?.id).not('product_name', 'is', null).order('scan_date', {
        ascending: false
      }).limit(3);
      if (error) {
        console.error('Error fetching recent scans:', error);
        toast({
          title: "Error",
          description: "Failed to load recent scans",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match our interface
      const transformedData = (data || []).map(scan => ({
        id: scan.id,
        scan_date: scan.scan_date,
        average_score: scan.average_score || 0,
        product_name: scan.product_name || '',
        brand: scan.brand || '',
        barcode: scan.barcode || '',
        image_urls: scan.image_urls || []
      }));
      setRecentScans(transformedData);
    } catch (error) {
      console.error('Error fetching recent scans:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading scans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  const formatScanDate = (dateString: string) => {
    const scanDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - scanDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return scanDate.toLocaleDateString();
  };
  const getProductImage = (scan: ScanSummary) => {
    // Check if image_urls exists and has at least one image
    if (scan.image_urls && Array.isArray(scan.image_urls) && scan.image_urls.length > 0) {
      return scan.image_urls[0];
    }
    return null;
  };
  const handleScanClick = (scan: ScanSummary) => {
    // Create a mock scan result object to navigate to the result page
    const mockScanResult = {
      product: {
        productName: scan.product_name,
        brand: scan.brand,
        barcode: scan.barcode,
        imageUrl: Array.isArray(scan.image_urls) && scan.image_urls.length > 0 ? scan.image_urls[0] : null,
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        },
        ingredients: [],
        additives: []
      },
      scoreEmoji: '📊',
      scoreInterpretation: 'Historical Scan',
      scoreColor: 'text-blue-600',
      primaryMessage: 'This is a previous scan result.',
      breakdown: {
        age_appropriateness: scan.average_score,
        nutritional_quality: scan.average_score,
        safety_processing: scan.average_score,
        personalization: scan.average_score,
        external_scores: scan.average_score
      },
      nutriscore: 'N/A',
      novaGroup: 0,
      ecoscore: 'N/A',
      detailedExplanations: ['This is a historical scan from your scan history.'],
      warningFlags: [],
      recommendations: []
    };
    navigate('/scan-result', {
      state: {
        scanResult: mockScanResult
      }
    });
  };
  const handleViewAll = () => {
    navigate('/scan-history');
  };
  if (loading) {
    return <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Recent Scans
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden animate-pulse">
              <div className="w-full h-16 bg-gray-200 rounded"></div>
            </div>)}
        </div>
      </div>;
  }
  if (recentScans.length === 0) {
    return <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No scans yet</h3>
        <p className="text-gray-600 text-sm">Start scanning foods to see your history here</p>
      </div>;
  }
  return <div className="bg-white rounded-2xl p-6 shadow-sm py-[15px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Recent Scans
        </h3>
        <button className="text-sm text-pink-500 hover:text-pink-600 font-medium" onClick={handleViewAll}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recentScans.map(scan => <div key={scan.id} onClick={() => handleScanClick(scan)} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden">
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {getProductImage(scan) ? <img src={getProductImage(scan)} alt={scan.product_name || 'Product'} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">
                    {scan.product_name || 'Unknown Product'}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {scan.brand && `${scan.brand} • `}{formatScanDate(scan.scan_date)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(scan.average_score)} flex-shrink-0`}>
                  {Math.round(scan.average_score)}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};