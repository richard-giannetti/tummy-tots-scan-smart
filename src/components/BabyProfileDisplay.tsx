
import React from 'react';
import { Baby, Edit3, AlertTriangle } from 'lucide-react';
import { BabyProfile } from '@/services/babyProfileService';

interface BabyProfileDisplayProps {
  babyProfile: BabyProfile;
  onEdit: () => void;
}

export const BabyProfileDisplay = ({ babyProfile, onEdit }: BabyProfileDisplayProps) => {
  const babyAge = babyProfile.birth_date ? 
    Math.floor((new Date().getTime() - new Date(babyProfile.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center mr-3">
            <Baby className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{babyProfile.name}</h3>
            <p className="text-sm text-gray-600">{babyAge} months old</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {babyProfile.allergies && babyProfile.allergies.length > 0 && (
        <div className="flex items-start space-x-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Allergies:</p>
            <p className="text-sm text-gray-600">{babyProfile.allergies.join(', ')}</p>
          </div>
        </div>
      )}

      {babyProfile.dietary_restrictions && babyProfile.dietary_restrictions.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Diet:</span> {babyProfile.dietary_restrictions.join(', ')}
        </div>
      )}
    </div>
  );
};
