
import React from 'react';
import { ChefHat, Clock, Users } from 'lucide-react';

interface RecipeRecommendationsProps {
  babyName: string;
}

export const RecipeRecommendations = ({ babyName }: RecipeRecommendationsProps) => {
  // Mock recipe data
  const recipes = [
    {
      id: 1,
      title: "Sweet Potato Mash",
      description: "Creamy and nutritious first food",
      time: "15 min",
      difficulty: "Easy",
      image: "🍠",
      ageAppropriate: "6+ months"
    },
    {
      id: 2,
      title: "Banana Oat Pancakes",
      description: "Baby-led weaning friendly",
      time: "20 min", 
      difficulty: "Easy",
      image: "🥞",
      ageAppropriate: "8+ months"
    },
    {
      id: 3,
      title: "Veggie Finger Foods",
      description: "Perfect for self-feeding",
      time: "25 min",
      difficulty: "Medium",
      image: "🥕",
      ageAppropriate: "9+ months"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
          Recipes for {babyName}
        </h3>
        <button className="text-sm text-pink-500 hover:text-pink-600 font-medium">
          More Recipes
        </button>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center space-x-4 p-3 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="text-3xl">{recipe.image}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">{recipe.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{recipe.description}</p>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {recipe.ageAppropriate}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Tip:</span> All recipes are tailored to {babyName}'s age and dietary needs. 
          Recipes automatically adjust as your baby grows!
        </p>
      </div>
    </div>
  );
};
