
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Heart, Shield } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Healthy Tummies",
      subtitle: "Smart food choices for your little one",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
            <Heart className="w-16 h-16 text-pink-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-gray-700">Scan any food product instantly</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Get baby-specific safety ratings</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-gray-700">Receive personalized recommendations</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Simple scanning for smarter choices",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">1. Scan</h4>
                <p className="text-gray-600 text-sm">Point your camera at any barcode</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">2. Analyze</h4>
                <p className="text-gray-600 text-sm">Our AI evaluates baby safety</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">3. Decide</h4>
                <p className="text-gray-600 text-sm">Get clear recommendations</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Baby-Specific Benefits",
      subtitle: "Tailored for your little one's needs",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded-full mx-auto flex items-center justify-center">
            <Shield className="w-16 h-16 text-green-600" />
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Age-Appropriate Guidance</h4>
              <p className="text-gray-600 text-sm">Recommendations based on your baby's developmental stage</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Allergy Protection</h4>
              <p className="text-gray-600 text-sm">Automatic alerts for known allergens and restrictions</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Science-Backed</h4>
              <p className="text-gray-600 text-sm">Based on pediatric nutrition guidelines</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
              <button 
                onClick={onComplete}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 mb-8">
              {steps[currentStep].subtitle}
            </p>
            {steps[currentStep].content}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
