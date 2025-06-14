
import React from 'react';
import { Award } from 'lucide-react';
import { HeaderMenu } from './HeaderMenu';

interface HomepageHeaderProps {
  showAchievements: boolean;
  setShowAchievements: (show: boolean) => void;
  language: string;
  onToggleLanguage: () => void;
  onSignOut: () => void;
}

export const HomepageHeader = ({
  showAchievements,
  setShowAchievements,
  language,
  onToggleLanguage,
  onSignOut
}: HomepageHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
          <img 
            src="/lovable-uploads/e2bdb845-2ddc-4739-a1cd-4a311c9d32e0.png" 
            alt="Healthy Tummies Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Healthy Tummies</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowAchievements(true)}
          className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors"
          title="View Achievements"
        >
          <Award className="w-5 h-5 text-yellow-600" />
        </button>
        <HeaderMenu
          language={language}
          onToggleLanguage={onToggleLanguage}
          onSignOut={onSignOut}
        />
      </div>
    </div>
  );
};
