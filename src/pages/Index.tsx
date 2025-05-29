
import React, { useState } from 'react';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { Homepage } from '../components/Homepage';

const Index = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock logged in state

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  if (!isLoggedIn) {
    // This would be the authentication flow
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Healthy Tummies</h1>
          <p className="text-gray-600 mb-8">Smart food choices for your little one</p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <Homepage />;
};

export default Index;
