
import React from 'react';

interface RecipeInstructionsProps {
  method: any;
}

export const RecipeInstructions = ({ method }: RecipeInstructionsProps) => {
  const renderMethod = (method: any) => {
    if (!method) return null;
    
    // Handle Json type - could be array or string
    let methodArray: any[] = [];
    
    if (Array.isArray(method)) {
      methodArray = method;
    } else if (typeof method === 'string') {
      try {
        const parsed = JSON.parse(method);
        methodArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        methodArray = [method];
      }
    } else if (typeof method === 'object') {
      methodArray = [method];
    }
    
    return methodArray.map((step, index) => {
      const stepText = typeof step === 'string' ? step : 
        step?.instruction || step?.step || JSON.stringify(step);
      
      return (
        <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <p className="text-gray-800 leading-relaxed">{stepText}</p>
        </div>
      );
    });
  };

  if (!method) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
      <div className="space-y-4">
        {renderMethod(method)}
      </div>
    </div>
  );
};
