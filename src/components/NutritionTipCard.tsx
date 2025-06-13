
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BabyProfile } from '@/services/babyProfileService';

interface Tip {
  tip_id: number;
  tip_title: string;
  tip_description: string;
  tip_age: string;
}

interface NutritionTipCardProps {
  babyProfile: BabyProfile | null;
  className?: string;
}

export const NutritionTipCard = ({ babyProfile, className = '' }: NutritionTipCardProps) => {
  const { user } = useAuth();
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [readTips, setReadTips] = useState<Set<number>>(new Set());
  const [availableTips, setAvailableTips] = useState<Tip[]>([]);

  // Get age badge color based on tip age
  const getAgeBadgeColor = (tipAge: string) => {
    if (tipAge.includes('0-6')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (tipAge.includes('6-12')) return 'bg-green-100 text-green-800 border-green-200';
    if (tipAge.includes('12') || tipAge.includes('24')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Fetch tips from database
  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching tips from Supabase...');
        
        // Simple query without count to avoid potential issues
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
      setIsExpanded(false);
    }
  };

  // Get new tip
  const getNewTip = () => {
    if (availableTips.length <= 1) return;
    
    const otherTips = availableTips.filter(tip => tip.tip_id !== currentTip?.tip_id);
    const randomTip = otherTips[Math.floor(Math.random() * otherTips.length)];
    setCurrentTip(randomTip);
    setIsExpanded(false);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Tips for {babyProfile?.name || 'Your Baby'}
              </h2>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentTip) {
    return (
      <div className={className}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Tips for {babyProfile?.name || 'Your Baby'}
              </h2>
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">No Tips Available</h3>
                <p className="text-sm text-gray-600">
                  No nutrition tips found in the database. Please check back later!
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Debug: {availableTips.length} tips in database
                </p>
                <p className="text-xs text-gray-500">
                  User: {user?.id ? 'Authenticated' : 'Not authenticated'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Tip Card with Header Inside */}
      <Card className="transition-all duration-300 ease-in-out hover:shadow-md">
        <CardContent className="p-0">
          {/* Section Header Inside Card */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Tips for {babyProfile?.name || 'Your Baby'}
              </h2>
            </div>
          </div>

          {/* Collapsed/Expanded State */}
          <div 
            className={`p-4 cursor-pointer transition-all duration-300 ${!isExpanded ? 'hover:bg-gray-50' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`text-xs border ${getAgeBadgeColor(currentTip.tip_age)}`}>
                    {currentTip.tip_age}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                  {currentTip.tip_title}
                </h3>
                {!isExpanded && (
                  <p className="text-xs text-gray-500 mt-1">Tap to read more</p>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-gray-100">
              <div className="p-4 space-y-4">
                <div className="max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentTip.tip_description}
                  </p>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <div className="flex space-x-2">
                    {availableTips.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          getNewTip();
                        }}
                        className="text-xs"
                      >
                        New Tip
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead();
                      }}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark as Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
