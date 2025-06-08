
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ScanSummary {
  id: string;
  scan_date: string;
  average_score: number;
  product_name: string;
  brand: string;
  barcode: string;
  image_urls: any;
}

const ScanHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllScans();
    }
  }, [user]);

  const fetchAllScans = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scan_summary')
        .select('*')
        .eq('user_id', user?.id)
        .not('product_name', 'is', null)
        .order('scan_date', { ascending: false });

      if (error) {
        console.error('Error fetching scan history:', error);
        toast({
          title: "Error",
          description: "Failed to load scan history",
          variant: "destructive",
        });
        return;
      }

      const transformedData = (data || []).map(scan => ({
        id: scan.id,
        scan_date: scan.scan_date,
        average_score: scan.average_score || 0,
        product_name: scan.product_name || '',
        brand: scan.brand || '',
        barcode: scan.barcode || '',
        image_urls: scan.image_urls || []
      }));

      setScans(transformedData);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      toast({
        title: "Error", 
        description: "An unexpected error occurred while loading scan history",
        variant: "destructive",
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

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
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

  const getProductEmoji = (productName: string, brand: string) => {
    const name = (productName + ' ' + brand).toLowerCase();
    if (name.includes('cereal') || name.includes('oat')) return '🥣';
    if (name.includes('apple') || name.includes('fruit')) return '🍎';
    if (name.includes('yogurt') || name.includes('milk')) return '🥛';
    if (name.includes('vegetable') || name.includes('carrot')) return '🥕';
    if (name.includes('banana')) return '🍌';
    if (name.includes('baby') || name.includes('infant')) return '👶';
    return '🍼';
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

    navigate('/scan-result', { state: { scanResult: mockScanResult } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Scan History</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-xl border-2 border-gray-200 animate-pulse bg-white">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : scans.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No scans yet</h3>
            <p className="text-gray-600 text-sm">Start scanning foods to see your history here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => handleScanClick(scan)}
                className={`flex items-center space-x-4 p-3 rounded-xl border-2 ${getScoreBorder(scan.average_score)} hover:shadow-sm transition-all cursor-pointer bg-white`}
              >
                <div className="text-2xl">{getProductEmoji(scan.product_name || '', scan.brand || '')}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {scan.product_name || 'Unknown Product'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {scan.brand && `${scan.brand} • `}{formatScanDate(scan.scan_date)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(scan.average_score)}`}>
                  {Math.round(scan.average_score)}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanHistory;
