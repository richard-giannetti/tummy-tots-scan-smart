
import React from 'react';

interface FeedingInformationSectionProps {
  formData: {
    feeding_stage: 'exclusive_milk' | 'introducing_solids' | 'mixed_feeding' | 'toddler_food' | '';
    feeding_type: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export const FeedingInformationSection = ({ formData, setFormData }: FeedingInformationSectionProps) => {
  const feedingStageOptions = [
    { value: 'exclusive_milk' as const, label: 'Exclusive milk feeding (0-6 months)' },
    { value: 'introducing_solids' as const, label: 'Introducing solids (6-12 months)' },
    { value: 'mixed_feeding' as const, label: 'Mixed feeding (6-24 months)' },
    { value: 'toddler_food' as const, label: 'Toddler foods (12+ months)' }
  ];

  const feedingOptions = [
    { value: 'breastfed', label: 'Breastfed' },
    { value: 'formula', label: 'Formula-fed' },
    { value: 'mixed', label: 'Mixed (breast + formula)' }
  ];

  return (
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
                feeding_stage: prev.feeding_stage === option.value ? '' : option.value
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
  );
};
