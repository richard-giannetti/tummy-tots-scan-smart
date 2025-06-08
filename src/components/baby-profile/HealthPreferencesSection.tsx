
import React from 'react';

interface HealthPreferencesSectionProps {
  formData: {
    feeding_goals: string[];
    health_conditions: string[];
    dietary_preferences: string[];
    allergies: string[];
    dietary_restrictions: string[];
    medical_conditions: string[];
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export const HealthPreferencesSection = ({ formData, setFormData }: HealthPreferencesSectionProps) => {
  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const feedingGoalOptions = ['Weight gain', 'Brain development', 'Digestive health', 'General nutrition', 'Immune support'];
  const healthConditionOptions = ['Reflux', 'Constipation', 'Eczema', 'Food sensitivities'];
  const dietaryPreferenceOptions = ['Organic only', 'No artificial additives', 'Low sodium', 'Sugar-free'];
  const allergyOptions = ['Dairy', 'Eggs', 'Nuts', 'Soy', 'Wheat', 'Shellfish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher'];
  const medicalConditionOptions = ['Down syndrome', 'Cerebral palsy', 'Heart conditions'];

  return (
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
  );
};
