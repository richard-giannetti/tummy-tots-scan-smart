import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
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
  image_urls: any; // Changed from string[] to any to handle Json type from database
}

export const RecentScans = () => {
  const { user } = useAuth();
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
      
      const { data, error } = await supabase
        .from('scan_summary')
        .select('*')
        .eq('user_id', user?.id)
        .not('product_name', 'is', null)
        .order('scan_date', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent scans:', error);
        toast({
          title: "Error",
          description: "Failed to load recent scans",
          variant: "destructive",
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Recent Scans
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-xl border-2 border-gray-200 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentScans.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No scans yet</h3>
        <p className="text-gray-600 text-sm">Start scanning foods to see your history here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Recent Scans
        </h3>
        <button 
          className="text-sm text-pink-500 hover:text-pink-600 font-medium"
          onClick={() => toast({ title: "Coming Soon", description: "Full scan history feature coming soon!" })}
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recentScans.map((scan) => (
          <div
            key={scan.id}
            className={`flex items-center space-x-4 p-3 rounded-xl border-2 ${getScoreBorder(scan.average_score)} hover:shadow-sm transition-all cursor-pointer`}
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
    </div>
  );
};
