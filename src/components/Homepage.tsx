import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { BabyProfileCard } from './BabyProfileCard';
import { ScanButton } from './ScanButton';
import { RecentScans } from './RecentScans';
import { RecipeRecommendations } from './RecipeRecommendations';
import { FoodFacts } from './FoodFacts';
import { HeaderMenu } from './HeaderMenu';
import { BottomNavigation } from './BottomNavigation';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Homepage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

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

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
    toast({
      title: "Language changed",
      description: `Switched to ${language === 'en' ? 'Spanish' : 'English'}`,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header with app title and menu */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">HT</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Healthy Tummies</h1>
        </div>
        <HeaderMenu
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onSignOut={handleSignOut}
        />
      </div>
      
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

      {/* Bottom Navigation */}
      <BottomNavigation currentRoute="/" />
    </div>
  );
};
