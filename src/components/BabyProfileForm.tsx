
import React, { useState, useEffect } from 'react';
import { Baby, Info } from 'lucide-react';
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
    dietary_restrictions: [] as string[],
    feeding_type: '',
    medical_conditions: [] as string[]
  });

  useEffect(() => {
    if (babyProfile) {
      setFormData({
        name: babyProfile.name || '',
        birth_date: babyProfile.birth_date || '',
        allergies: babyProfile.allergies || [],
        dietary_restrictions: babyProfile.dietary_restrictions || [],
        feeding_type: babyProfile.feeding_type || '',
        medical_conditions: babyProfile.medical_conditions || []
      });
    }
  }, [babyProfile]);

  const allergyOptions = ['Dairy', 'Eggs', 'Nuts', 'Soy', 'Wheat', 'Shellfish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher'];
  const feedingOptions = [
    { value: 'breastfed', label: 'Breastfed' },
    { value: 'formula', label: 'Formula-fed' },
    { value: 'mixed', label: 'Mixed (breast + formula)' }
  ];
  const medicalConditionOptions = ['Down syndrome', 'Cerebral palsy', 'Heart conditions'];

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

  const toggleMedicalCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.includes(condition)
        ? prev.medical_conditions.filter(c => c !== condition)
        : [...prev.medical_conditions, condition]
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

      {/* Scientific research note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Why we ask for additional information</p>
            <p>Based on scientific research, feeding patterns and medical conditions significantly impact nutritional needs. This information helps us provide more personalized and safe food recommendations for your baby's optimal development.</p>
          </div>
        </div>
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
            Feeding Type <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {feedingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  feeding_type: prev.feeding_type === option.value ? '' : option.value 
                }))}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  formData.feeding_type === option.value
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Allergies <span className="text-sm text-gray-500">(Optional)</span>
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
            Dietary Restrictions <span className="text-sm text-gray-500">(Optional)</span>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {medicalConditionOptions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => toggleMedicalCondition(condition)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  formData.medical_conditions.includes(condition)
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {condition}
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
