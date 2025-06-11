
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { BottomNavigation } from './BottomNavigation';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { HomepageHeader } from './HomepageHeader';
import { AchievementManager } from './AchievementManager';
import { HomepageMainContent } from './HomepageMainContent';

export const Homepage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showAchievements, setShowAchievements] = useState(false);
  
  const { 
    progress, 
    achievements, 
    newAchievements, 
    loading: gamificationLoading,
    awardPoints,
    dismissAchievement
  } = useGamification();

  useEffect(() => {
    if (user) {
      fetchBabyProfile();
    }
  }, [user]);

  // Auto-reset points if there's a major discrepancy
  useEffect(() => {
    if (progress && achievements.length > 0) {
      const unlockedAchievements = achievements.filter(a => a.unlocked);
      const expectedPoints = unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0);
      
      // If the difference is more than 1000 points, suggest a reset
      if (progress.total_points - expectedPoints > 1000) {
        console.log(`Large discrepancy detected: ${progress.total_points} actual vs ${expectedPoints} expected`);
        toast({
          title: "Points Discrepancy Detected",
          description: "Your points seem incorrect. Click the reset button to fix this.",
          variant: "destructive",
        });
      }
    }
  }, [progress, achievements]);

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

  const handleProfileComplete = async (profileData: BabyProfile | Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => {
    try {
      // If we have a complete profile (with ID), just update the state
      if ('id' in profileData && profileData.id) {
        setBabyProfile(profileData as BabyProfile);
        setHasProfile(true);
        toast({
          title: "Success!",
          description: "Profile updated successfully!",
        });
        return;
      }

      // Otherwise, save the profile data
      const dataToSave = profileData as Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>;
      const result = await BabyProfileService.saveBabyProfile(dataToSave);
      
      if (result.success && result.profile) {
        setBabyProfile(result.profile);
        setHasProfile(true);
        
        // Award points for profile completion (only for new profiles)
        if (!hasProfile) {
          await awardPoints('profile');
        }
        
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

  if (loading || gamificationLoading) {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      <AchievementManager
        newAchievements={newAchievements}
        showAchievements={showAchievements}
        achievements={achievements}
        onCloseModal={() => setShowAchievements(false)}
        onDismissAchievement={dismissAchievement}
      />

      <HomepageHeader
        showAchievements={showAchievements}
        setShowAchievements={setShowAchievements}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSignOut={handleSignOut}
      />
      
      <HomepageMainContent
        hasProfile={hasProfile}
        babyProfile={babyProfile}
        progress={progress}
        onProfileComplete={handleProfileComplete}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentRoute="/" />
    </div>
  );
};
