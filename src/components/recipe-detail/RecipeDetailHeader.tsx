import React from 'react';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { Recipe } from '@/services/recipes';

interface RecipeDetailHeaderProps {
  recipe: Recipe;
  isFavorited: boolean;
  isTogglingFavorite: boolean;
  onBackClick: () => void;
  onShare: () => void;
  onFavoriteToggle: () => void;
}

export const RecipeDetailHeader = ({
  recipe,
  isFavorited,
  isTogglingFavorite,
  onBackClick,
  onShare,
  onFavoriteToggle,
}: RecipeDetailHeaderProps) => {
  return (
    <div className="relative h-64 bg-gray-200 overflow-hidden">
      <img 
        src={recipe.link || '/placeholder.svg'} 
        alt={recipe.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <button 
          onClick={onBackClick}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onShare}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onFavoriteToggle}
            disabled={isTogglingFavorite}
            className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
