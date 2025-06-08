
import React, { useState, useEffect } from 'react';
import { BabyProfile } from '@/services/babyProfileService';
import { ProfileFormHeader } from './baby-profile/ProfileFormHeader';
import { BasicInformationSection } from './baby-profile/BasicInformationSection';
import { FeedingInformationSection } from './baby-profile/FeedingInformationSection';
import { HealthPreferencesSection } from './baby-profile/HealthPreferencesSection';

interface BabyProfileFormProps {
  hasProfile: boolean;
  babyProfile: BabyProfile | null;
  onSubmit: (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => void;
  onCancel?: () => void;
}

export const BabyProfileForm = ({ hasProfile, babyProfile, onSubmit, onCancel }: BabyProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    weight_kg: undefined as number | undefined,
    feeding_stage: '' as 'exclusive_milk' | 'introducing_solids' | 'mixed_feeding' | 'toddler_food' | '',
    allergies: [] as string[],
    dietary_restrictions: [] as string[],
    dietary_preferences: [] as string[],
    health_conditions: [] as string[],
    feeding_goals: [] as string[],
    feeding_type: '',
    medical_conditions: [] as string[]
  });

  useEffect(() => {
    if (babyProfile) {
      setFormData({
        name: babyProfile.name || '',
        birth_date: babyProfile.birth_date || '',
        weight_kg: babyProfile.weight_kg || undefined,
        feeding_stage: babyProfile.feeding_stage || '',
        allergies: babyProfile.allergies || [],
        dietary_restrictions: babyProfile.dietary_restrictions || [],
        dietary_preferences: babyProfile.dietary_preferences || [],
        health_conditions: babyProfile.health_conditions || [],
        feeding_goals: babyProfile.feeding_goals || [],
        feeding_type: babyProfile.feeding_type || '',
        medical_conditions: babyProfile.medical_conditions || []
      });
    }
  }, [babyProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.birth_date) {
      onSubmit({
        ...formData,
        feeding_stage: formData.feeding_stage || undefined,
        dietary_preferences: formData.dietary_preferences,
        health_conditions: formData.health_conditions,
        feeding_goals: formData.feeding_goals
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <ProfileFormHeader hasProfile={hasProfile} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInformationSection formData={formData} setFormData={setFormData} />
        <FeedingInformationSection formData={formData} setFormData={setFormData} />
        <HealthPreferencesSection formData={formData} setFormData={setFormData} />

        <div className="flex space-x-3 pt-4">
          {hasProfile && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            {hasProfile ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
