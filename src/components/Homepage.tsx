
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { BabyProfileCard } from './BabyProfileCard';
import { ScanButton } from './ScanButton';
import { RecentScans } from './RecentScans';
import { RecipeRecommendations } from './RecipeRecommendations';
import { FoodFacts } from './FoodFacts';
import { HeaderMenu } from './HeaderMenu';
import { toast } from '@/hooks/use-toast';

export const Homepage = () => {
  const { user } = useAuth();
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBabyProfile();
    }
  }, [user]);

  const fetchBabyProfile = async () => {
    try {
      setLoading(true);
      const result = await BabyProfileService.getBabyProfile();
      
      if (result.success) {
        if (result.profile) {
          setBabyProfile(result.profile);
          setHasProfile(true);
        } else {
          setBabyProfile(null);
          setHasProfile(false);
        }
      } else {
        console.error('Failed to fetch baby profile:', result.error);
        toast({
          title: "Error",
          description: "Failed to load baby profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching baby profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const result = await BabyProfileService.saveBabyProfile(profileData);
      
      if (result.success && result.profile) {
        setBabyProfile(result.profile);
        setHasProfile(true);
        toast({
          title: "Success!",
          description: hasProfile ? "Profile updated successfully!" : "Baby profile created successfully!",
        });
      } else {
        console.error('Failed to save baby profile:', result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to save baby profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving baby profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">HT</span>
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <HeaderMenu />
      
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Baby Profile Section */}
        <BabyProfileCard
          hasProfile={hasProfile}
          babyProfile={babyProfile}
          onProfileComplete={handleProfileComplete}
        />

        {/* Scan Button Section */}
        <ScanButton babyName={babyProfile?.name} />

        {/* Food Facts Section */}
        <FoodFacts babyName={babyProfile?.name} />

        {/* Recent Scans Section */}
        <RecentScans />

        {/* Recipe Recommendations Section */}
        <RecipeRecommendations babyName={babyProfile?.name} />
      </div>
    </div>
  );
};
