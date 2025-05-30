
import React, { useState, useEffect } from 'react';
import { Baby } from 'lucide-react';
import { BabyProfile } from '@/services/babyProfileService';

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
    allergies: [] as string[],
    dietary_restrictions: [] as string[]
  });

  useEffect(() => {
    if (babyProfile) {
      setFormData({
        name: babyProfile.name || '',
        birth_date: babyProfile.birth_date || '',
        allergies: babyProfile.allergies || [],
        dietary_restrictions: babyProfile.dietary_restrictions || []
      });
    }
  }, [babyProfile]);

  const allergyOptions = ['Dairy', 'Eggs', 'Nuts', 'Soy', 'Wheat', 'Shellfish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.birth_date) {
      onSubmit(formData);
    }
  };

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(restriction)
        ? prev.dietary_restrictions.filter(r => r !== restriction)
        : [...prev.dietary_restrictions, restriction]
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <Baby className="w-6 h-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">
          {hasProfile ? 'Edit Baby Profile' : 'Set Up Baby Profile'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby's Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your baby's name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Allergies
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allergyOptions.map((allergy) => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.allergies.includes(allergy)
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dietaryOptions.map((restriction) => (
              <button
                key={restriction}
                type="button"
                onClick={() => toggleDietaryRestriction(restriction)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.dietary_restrictions.includes(restriction)
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
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
