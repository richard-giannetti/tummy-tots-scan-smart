
import React, { useState, useEffect } from 'react';
import { Loader, Search, Brain, Stethoscope, BarChart3, CheckCircle } from 'lucide-react';

interface ScanLoadingScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  {
    id: 'searching',
    title: 'Searching for the item',
    description: 'Looking up product in our database...',
    icon: Search,
    duration: 1500,
  },
  {
    id: 'analyzing',
    title: 'Analyzing nutrients',
    description: 'Breaking down nutritional information...',
    icon: BarChart3,
    duration: 1200,
  },
  {
    id: 'ai-model',
    title: 'Applying AI model to the nutrients',
    description: 'Running advanced food safety algorithms...',
    icon: Brain,
    duration: 1800,
  },
  {
    id: 'pediatrician',
    title: 'Checking our Pediatrician models',
    description: 'Validating against medical guidelines...',
    icon: Stethoscope,
    duration: 1400,
  },
  {
    id: 'crunching',
    title: 'Crunching data',
    description: 'Calculating your Healthy Tummies Score...',
    icon: Loader,
    duration: 1000,
  },
];

const ScanLoadingScreen = ({ onComplete }: ScanLoadingScreenProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (currentStepIndex >= loadingSteps.length) {
      // All steps completed, wait a moment then call onComplete
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    const currentStep = loadingSteps[currentStepIndex];
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep.id]);
      setCurrentStepIndex(prev => prev + 1);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, onComplete]);

  const currentStep = loadingSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / loadingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center space-y-8">
          {/* Main loading animation */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center mb-8">
              {currentStep ? (
                <currentStep.icon className="w-16 h-16 text-pink-600 animate-pulse" />
              ) : (
                <CheckCircle className="w-16 h-16 text-green-600" />
              )}
            </div>
            
            {/* Progress ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Current step info */}
          {currentStep && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStep.title}
              </h2>
              <p className="text-gray-600">
                {currentStep.description}
              </p>
            </div>
          )}

          {/* All steps completed */}
          {currentStepIndex >= loadingSteps.length && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-green-800">
                Analysis Complete!
              </h2>
              <p className="text-gray-600">
                Preparing your results...
              </p>
            </div>
          )}

          {/* Steps list */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            {loadingSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStepIndex === index;
              const isPending = currentStepIndex < index;

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    isCurrent ? 'bg-pink-50 border border-pink-200' :
                    isCompleted ? 'bg-green-50' :
                    'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' :
                    isCurrent ? 'bg-pink-500' :
                    'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isCompleted ? 'text-green-700' :
                    isCurrent ? 'text-pink-700' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress percentage */}
          <p className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanLoadingScreen;
