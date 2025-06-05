
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/services/gamificationService';
import { Award, Lock } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal = ({
  isOpen,
  onClose,
  achievements
}: AchievementsModalProps) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scanning':
        return 'bg-blue-100 text-blue-800';
      case 'feeding':
        return 'bg-green-100 text-green-800';
      case 'consistency':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Your Achievements
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Summary */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">
              {unlockedAchievements.length}/{achievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-green-500 mr-2">🏆</span>
                Unlocked ({unlockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {achievement.name}
                        </h4>
                        <Badge variant="secondary" className={getCategoryColor(achievement.category)}>
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-400" />
                Coming Up ({lockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200 opacity-75"
                  >
                    <div className="text-2xl grayscale">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-600 text-sm">
                          {achievement.name}
                        </h4>
                        <Badge variant="outline" className="text-gray-500">
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
