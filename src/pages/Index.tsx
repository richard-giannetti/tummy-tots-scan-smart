
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { Homepage } from '../components/Homepage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch user profile to check onboarding status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setProfileLoading(true);
        const result = await AuthService.getUserProfile();
        
        if (result.success && result.profile) {
          setHasCompletedOnboarding(result.profile.onboarding_completed || false);
        } else {
          console.error('Failed to fetch user profile:', result.error);
          // Default to false if we can't fetch the profile
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user && !loading) {
      fetchUserProfile();
    }
  }, [user, loading]);

  const handleOnboardingComplete = async () => {
    try {
      const result = await AuthService.completeOnboarding();
      
      if (result.success) {
        setHasCompletedOnboarding(true);
        toast({
          title: "Welcome to Healthy Tummies!",
          description: "You're all set to start scanning food for your baby.",
        });
      } else {
        console.error('Failed to complete onboarding:', result.error);
        toast({
          title: "Error",
          description: "Failed to save onboarding progress. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">HT</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  if (hasCompletedOnboarding === false) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <Homepage />;
};

export default Index;
