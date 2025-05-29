
import React, { useState } from 'react';
import { Baby, Edit3, Calendar, AlertTriangle } from 'lucide-react';

interface BabyProfileCardProps {
  hasProfile: boolean;
  babyName: string;
  onProfileComplete: (name: string) => void;
}

export const BabyProfileCard = ({ hasProfile, babyName, onProfileComplete }: BabyProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(!hasProfile);
  const [formData, setFormData] = useState({
    name: babyName,
    birthDate: '',
    allergies: [] as string[],
    dietaryRestrictions: [] as string[],
    notes: ''
  });

  const allergyOptions = ['Dairy', 'Eggs', 'Nuts', 'Soy', 'Wheat', 'Shellfish'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onProfileComplete(formData.name);
      setIsEditing(false);
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
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  if (!hasProfile || isEditing) {
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
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
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
                    formData.dietaryRestrictions.includes(restriction)
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
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Any additional information about your baby's eating habits or preferences..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            {hasProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
  }

  const babyAge = formData.birthDate ? 
    Math.floor((new Date().getTime() - new Date(formData.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center mr-3">
            <Baby className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{babyName}</h3>
            <p className="text-sm text-gray-600">{babyAge} months old</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {formData.allergies.length > 0 && (
        <div className="flex items-start space-x-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Allergies:</p>
            <p className="text-sm text-gray-600">{formData.allergies.join(', ')}</p>
          </div>
        </div>
      )}

      {formData.dietaryRestrictions.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Diet:</span> {formData.dietaryRestrictions.join(', ')}
        </div>
      )}
    </div>
  );
};
