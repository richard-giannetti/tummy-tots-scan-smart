
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Achievement } from '@/services/gamificationService';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  isVisible: boolean;
}

export const AchievementNotification = ({
  achievement,
  onClose,
  isVisible
}: AchievementNotificationProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      animate ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'
    }`}>
      <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-4 max-w-sm mx-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bounce">{achievement.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-bold text-gray-800 text-sm">Achievement Unlocked!</h4>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  +{achievement.points} points
                </Badge>
              </div>
              <h5 className="font-semibold text-gray-700 text-sm mb-1">{achievement.name}</h5>
              <p className="text-xs text-gray-600 leading-tight">{achievement.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <p className="text-xs text-center text-gray-700">
            <span className="font-semibold">🎉 Amazing work!</span> Your parenting confidence is growing!
          </p>
        </div>
      </div>
    </div>
  );
};
