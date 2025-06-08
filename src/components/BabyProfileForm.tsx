
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

  const allergyOptions = ['Dairy', 'Eggs', 'Nuts', 'Soy', 'Wheat', 'Shellfish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher'];
  const dietaryPreferenceOptions = ['Organic only', 'No artificial additives', 'Low sodium', 'Sugar-free'];
  const healthConditionOptions = ['Reflux', 'Constipation', 'Eczema', 'Food sensitivities'];
  const feedingGoalOptions = ['Weight gain', 'Brain development', 'Digestive health', 'General nutrition', 'Immune support'];
  const feedingStageOptions = [
    { value: 'exclusive_milk', label: 'Exclusive milk feeding (0-6 months)' },
    { value: 'introducing_solids', label: 'Introducing solids (6-12 months)' },
    { value: 'mixed_feeding', label: 'Mixed feeding (6-24 months)' },
    { value: 'toddler_food', label: 'Toddler foods (12+ months)' }
  ];
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

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
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
            <p className="font-medium mb-1">Enhanced Healthy Tummies Score</p>
            <p>We now use advanced algorithms based on WHO/AAP guidelines to provide personalized nutrition scores. The more information you provide, the more accurate our recommendations become.</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
          
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
              Current Weight (kg) <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="2"
              max="30"
              value={formData.weight_kg || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value ? parseFloat(e.target.value) : undefined }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., 8.5"
            />
          </div>
        </div>

        {/* Feeding Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Feeding Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Feeding Stage <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {feedingStageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    feeding_stage: prev.feeding_stage === option.value ? '' : option.value as any
                  }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    formData.feeding_stage === option.value
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
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
        </div>

        {/* Health & Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Health & Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feeding Goals <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedingGoalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleArrayItem(formData.feeding_goals, goal, (items) => 
                    setFormData(prev => ({ ...prev, feeding_goals: items }))
                  )}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.feeding_goals.includes(goal)
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Conditions <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {healthConditionOptions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleArrayItem(formData.health_conditions, condition, (items) => 
                    setFormData(prev => ({ ...prev, health_conditions: items }))
                  )}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.health_conditions.includes(condition)
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Preferences <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dietaryPreferenceOptions.map((preference) => (
                <button
                  key={preference}
                  type="button"
                  onClick={() => toggleArrayItem(formData.dietary_preferences, preference, (items) => 
                    setFormData(prev => ({ ...prev, dietary_preferences: items }))
                  )}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.dietary_preferences.includes(preference)
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {preference}
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
                  onClick={() => toggleArrayItem(formData.allergies, allergy, (items) => 
                    setFormData(prev => ({ ...prev, allergies: items }))
                  )}
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
                  onClick={() => toggleArrayItem(formData.dietary_restrictions, restriction, (items) => 
                    setFormData(prev => ({ ...prev, dietary_restrictions: items }))
                  )}
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
                  onClick={() => toggleArrayItem(formData.medical_conditions, condition, (items) => 
                    setFormData(prev => ({ ...prev, medical_conditions: items }))
                  )}
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
        </div>

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
