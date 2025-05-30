
import React, { useState, useEffect } from 'react';
import { Camera, Clock, BookOpen, User, Globe, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BabyProfileCard } from './BabyProfileCard';
import { ScanButton } from './ScanButton';
import { RecentScans } from './RecentScans';
import { RecipeRecommendations } from './RecipeRecommendations';
import { BabyProfileService, BabyProfile } from '@/services/babyProfileService';
import { toast } from '@/hooks/use-toast';

export const Homepage = () => {
  const [language, setLanguage] = useState('en');
  const [hasBabyProfile, setHasBabyProfile] = useState(false);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { signOut, user } = useAuth();

  // Load baby profile on component mount
  useEffect(() => {
    const loadBabyProfile = async () => {
      if (!user) return;

      try {
        setProfileLoading(true);
        const result = await BabyProfileService.getBabyProfile();
        
        if (result.success) {
          if (result.profile) {
            setBabyProfile(result.profile);
            setHasBabyProfile(true);
          } else {
            setBabyProfile(null);
            setHasBabyProfile(false);
          }
        } else {
          console.error('Failed to load baby profile:', result.error);
          toast({
            title: "Error",
            description: "Failed to load baby profile. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading baby profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadBabyProfile();
  }, [user]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleBabyProfileComplete = async (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const result = await BabyProfileService.saveBabyProfile(profileData);
      
      if (result.success && result.profile) {
        setBabyProfile(result.profile);
        setHasBabyProfile(true);
        toast({
          title: "Profile Saved!",
          description: "Your baby's profile has been saved successfully.",
        });
      } else {
        console.error('Failed to save baby profile:', result.error);
        toast({
          title: "Error",
          description: "Failed to save baby profile. Please try again.",
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

  const handleSignOut = async () => {
    await signOut();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">HT</span>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">HT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Healthy Tummies</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Baby Profile Card */}
        <BabyProfileCard 
          hasProfile={hasBabyProfile}
          babyProfile={babyProfile}
          onProfileComplete={handleBabyProfileComplete}
        />

        {/* Scan Action Card */}
        <ScanButton babyName={babyProfile?.name || ''} />

        {/* Recent Scans */}
        {hasBabyProfile && <RecentScans />}

        {/* Recipe Recommendations */}
        {hasBabyProfile && <RecipeRecommendations babyName={babyProfile?.name || ''} />}

        {/* Education Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
            How Healthy Tummies Works
          </h3>
          <div className="space-y-3">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-gray-700 hover:text-gray-900">
                <span className="font-medium">Our Scoring System</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                We analyze products using pediatric nutrition guidelines, considering your baby's age, allergies, and developmental needs to provide personalized safety scores.
              </p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-gray-700 hover:text-gray-900">
                <span className="font-medium">Scientific Backing</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Our recommendations are based on current pediatric research and guidelines from leading health organizations worldwide.
              </p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-gray-700 hover:text-gray-900">
                <span className="font-medium">Privacy & Security</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Your baby's data is encrypted and secure. We never share personal information and you control all your data.
              </p>
            </details>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            <button className="flex flex-col items-center py-2 px-3 text-pink-500">
              <div className="w-6 h-6 mb-1">🏠</div>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center py-2 px-3 text-gray-400">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Scan</span>
            </button>
            <button className="flex flex-col items-center py-2 px-3 text-gray-400">
              <Clock className="w-6 h-6 mb-1" />
              <span className="text-xs">History</span>
            </button>
            <button className="flex flex-col items-center py-2 px-3 text-gray-400">
              <BookOpen className="w-6 h-6 mb-1" />
              <span className="text-xs">Recipes</span>
            </button>
            <button className="flex flex-col items-center py-2 px-3 text-gray-400">
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
