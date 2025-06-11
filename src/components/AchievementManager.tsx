
import React from 'react';
import { AchievementNotification } from './AchievementNotification';
import { AchievementsModal } from './AchievementsModal';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementManagerProps {
  newAchievements: Achievement[];
  showAchievements: boolean;
  achievements: Achievement[];
  onCloseModal: () => void;
  onDismissAchievement: (id: string) => void;
}

export const AchievementManager = ({
  newAchievements,
  showAchievements,
  achievements,
  onCloseModal,
  onDismissAchievement
}: AchievementManagerProps) => {
  return (
    <>
      {/* Achievement Notifications */}
      {newAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          isVisible={true}
          onClose={() => onDismissAchievement(achievement.id)}
        />
      ))}

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={onCloseModal}
        achievements={achievements}
      />
    </>
  );
};
