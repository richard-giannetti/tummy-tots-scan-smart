
import React from 'react';
import { X, CheckCircle, Circle, AlertTriangle, Clock, Heart } from 'lucide-react';
import { FoodWithIntroduction } from '@/services/introducedFoodsService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FoodDetailModalProps {
  food: FoodWithIntroduction;
  babyName?: string;
  isOpen: boolean;
  onClose: () => void;
  onToggleIntroduced: (food: FoodWithIntroduction) => void;
}

export const FoodDetailModal = ({ 
  food, 
  babyName, 
  isOpen, 
  onClose, 
  onToggleIntroduced 
}: FoodDetailModalProps) => {
  const getAgeText = (ageText: string | null) => {
    if (!ageText) return null;
    return ageText.replace(/\b(\d+)\s*(month|months)\b/gi, '$1 months');
  };

  const renderInfoSection = (title: string, content: string | null, icon: React.ReactNode) => {
    if (!content || content.trim() === '') return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800 ml-2">{title}</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>
    );
  };

  const renderServingSuggestions = () => {
    const suggestions = [
      { age: '6 months', content: food.servingSuggestion6Months },
      { age: '12 months', content: food.servingSuggestion12Months },
      { age: '3 years', content: food.servingSuggestion3Years }
    ].filter(s => s.content && s.content.trim() !== '');

    if (suggestions.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 ml-2">Serving Suggestions</h3>
        </div>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4">
              <div className="font-medium text-blue-800 mb-2">{suggestion.age}</div>
              <p className="text-blue-700">{suggestion.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">
              {food.name || 'Food Details'}
            </span>
            <button
              onClick={() => onToggleIntroduced(food)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                food.introduced
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {food.introduced ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Introduced
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  Mark as Introduced
                </>
              )}
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {/* Food Image and Basic Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {food.Image ? (
                <img 
                  src={food.Image} 
                  alt={food.name || 'Food'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <span className="text-3xl">🍎</span>
              )}
              <span className="text-3xl hidden">🍎</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {food.name || 'Unknown Food'}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {food.foodType && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {food.foodType}
                  </span>
                )}
                {food.introduced && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Introduced on {new Date(food.introduced_date!).toLocaleDateString()}
                  </span>
                )}
                {food.commonAllergen && food.commonAllergen.toLowerCase() === 'yes' && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⚠️ Common Allergen
                  </span>
                )}
                {food.ironRich && food.ironRich.toLowerCase() === 'yes' && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Iron Rich
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Introduction Summary */}
          {renderInfoSection(
            'Introduction Guide',
            food.introductionSummary,
            <Heart className="w-5 h-5 text-pink-600" />
          )}

          {/* Age Suggestion */}
          {food.ageSuggestion && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800 ml-2">When to Introduce</h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-purple-700 font-medium">
                  {getAgeText(food.ageSuggestion) || food.ageSuggestion}
                </p>
                {babyName && (
                  <p className="text-purple-600 text-sm mt-1">
                    Perfect timing for {babyName}!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Health Benefits */}
          {renderInfoSection(
            'Health Benefits',
            food.healthBenefits,
            <Heart className="w-5 h-5 text-red-600" />
          )}

          {/* Serving Suggestions */}
          {renderServingSuggestions()}

          {/* Allergen Information */}
          {food.allergenInfo && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800 ml-2">Allergen Information</h3>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">{food.allergenInfo}</p>
              </div>
            </div>
          )}

          {/* Choking Hazard Info */}
          {food.chokingHazardInfo && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800 ml-2">Safety Information</h3>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{food.chokingHazardInfo}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={() => onToggleIntroduced(food)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                food.introduced
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {food.introduced ? 'Remove from Introduced' : 'Mark as Introduced'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
