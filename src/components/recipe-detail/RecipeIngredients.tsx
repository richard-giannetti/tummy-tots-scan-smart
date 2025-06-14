
import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface RecipeIngredientsProps {
  ingredients: any;
}

export const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredientCheck = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const renderIngredients = (ingredients: any) => {
    if (!ingredients) return null;
    
    // Handle Json type - could be array or string
    let ingredientArray: any[] = [];
    
    if (Array.isArray(ingredients)) {
      ingredientArray = ingredients;
    } else if (typeof ingredients === 'string') {
      try {
        const parsed = JSON.parse(ingredients);
        ingredientArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        ingredientArray = [ingredients];
      }
    } else if (typeof ingredients === 'object') {
      ingredientArray = [ingredients];
    }
    
    return ingredientArray.map((ingredient, index) => {
      const ingredientText = typeof ingredient === 'string' ? ingredient : 
        ingredient?.name || ingredient?.ingredient || JSON.stringify(ingredient);
      
      return (
        <div 
          key={index}
          className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
            checkedIngredients.has(index) 
              ? 'bg-green-50 border-green-200' 
              : 'bg-white border-gray-200 hover:border-pink-200'
          }`}
          onClick={() => toggleIngredientCheck(index)}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
            checkedIngredients.has(index)
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300'
          }`}>
            {checkedIngredients.has(index) && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={`flex-1 ${checkedIngredients.has(index) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {ingredientText}
          </span>
        </div>
      );
    });
  };

  if (!ingredients) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
      <div className="space-y-2">
        {renderIngredients(ingredients)}
      </div>
    </div>
  );
};
