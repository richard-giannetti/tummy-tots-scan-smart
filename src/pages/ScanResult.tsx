import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScanResult } from '@/services/scanService';
import { ArrowLeft, Camera, AlertTriangle, Lightbulb, Package, Share2, MessageSquare } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.scanResult) {
      setScanResult(location.state.scanResult);
    } else {
      // Redirect to home if no scan result is available
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleScanAnother = () => {
    navigate('/scan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Scan Result</h1>
          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowReviewsModal(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {scanResult && (
          <>
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {scanResult.product.imageUrl ? (
                    <img 
                      src={scanResult.product.imageUrl} 
                      alt={scanResult.product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {scanResult.product.productName}
                  </h2>
                  <p className="text-gray-600 text-sm">{scanResult.product.brand}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Healthy Tummies Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-4xl mr-2">{scanResult.scoreEmoji}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Healthy Tummies Score</h3>
                    <p className={`text-lg font-semibold ${scanResult.scoreColor}`}>
                      {scanResult.scoreInterpretation}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm max-w-sm mx-auto">
                  {scanResult.primaryMessage}
                </p>
              </div>

              {/* Detailed Explanations */}
              {scanResult.detailedExplanations && scanResult.detailedExplanations.length > 0 && (
                <div className="space-y-2 mb-6">
                  {scanResult.detailedExplanations.map((explanation, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Score Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-3">Score Breakdown</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Age Appropriateness</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.breakdown.age_appropriateness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.breakdown.age_appropriateness}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nutritional Quality</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.breakdown.nutritional_quality}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.breakdown.nutritional_quality}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Safety & Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.breakdown.safety_processing}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.breakdown.safety_processing}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Personalization</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.breakdown.personalization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.breakdown.personalization}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">External Scores</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.breakdown.external_scores}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.breakdown.external_scores}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Flags */}
            {scanResult.warningFlags && scanResult.warningFlags.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <h4 className="font-semibold text-red-800">Important Considerations</h4>
                </div>
                <ul className="space-y-1">
                  {scanResult.warningFlags.map((flag, index) => (
                    <li key={index} className="text-sm text-red-700">• {flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {scanResult.recommendations && scanResult.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-500 mr-2" />
                  <h4 className="font-semibold text-blue-800">Recommendations</h4>
                </div>
                <ul className="space-y-1">
                  {scanResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-700">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* External Scores */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">External Scores</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nutri-Score</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.nutriscore}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">NOVA Group</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.novaGroup}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Eco-Score</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.ecoscore}</p>
                </div>
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nutritional Information (per 100g)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Calories</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Protein</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.protein} g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Carbs</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.carbs} g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Fat</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.fat} g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Fiber</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.fiber} g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Sugar</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.sugar} g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Sodium</p>
                  <p className="text-xl font-bold text-gray-800">{scanResult.product.nutritionalInfo.sodium} mg</p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-700">
                {scanResult.product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleScanAnother}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Scan Another Product</span>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </main>

      {/* Share Modal */}
      <Sheet open={showShareModal} onOpenChange={setShowShareModal}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Share Product Scan</SheetTitle>
            <SheetDescription>
              Share this product scan with your friends and family.
            </SheetDescription>
          </SheetHeader>
          {/* Add sharing options here */}
          <Button onClick={() => setShowShareModal(false)}>Close</Button>
        </SheetContent>
      </Sheet>

      {/* Reviews Modal */}
      <Sheet open={showReviewsModal} onOpenChange={setShowReviewsModal}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Product Reviews</SheetTitle>
            <SheetDescription>
              See what others are saying about this product.
            </SheetDescription>
          </SheetHeader>
          {/* Add reviews or link to reviews here */}
           <Button onClick={() => setShowReviewsModal(false)}>Close</Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ScanResult;
