
import React from 'react';

interface BasicInformationSectionProps {
  formData: {
    name: string;
    birth_date: string;
    weight_kg: number | undefined;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export const BasicInformationSection = ({ formData, setFormData }: BasicInformationSectionProps) => {
  return (
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
  );
};
