import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type ScanResult as ScanResultType } from '@/services/scanService';
import { ArrowLeft, Camera, AlertTriangle, Lightbulb, Package, Share2, Info, Star, MessageSquare } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ShareModal } from '@/components/ShareModal';
import { ReviewsModal } from '@/components/ReviewsModal';

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);
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

  // Helper function to get emoji for score quality
  const getScoreEmoji = (score: string, scoreType: 'nutri' | 'nova' | 'eco') => {
    if (!score || score === 'unknown' || score === 'not-applicable') return '❓';
    
    switch (scoreType) {
      case 'nutri':
        // Nutri-Score: A is best, E is worst
        switch (score.toLowerCase()) {
          case 'a': return '🟢';
          case 'b': return '🟡';
          case 'c': return '🟠';
          case 'd': return '🔴';
          case 'e': return '🔴';
          default: return '❓';
        }
      case 'nova':
        // NOVA: 1 is best (unprocessed), 4 is worst (ultra-processed)
        switch (score) {
          case '1': return '🟢';
          case '2': return '🟡';
          case '3': return '🟠';
          case '4': return '🔴';
          default: return '❓';
        }
      case 'eco':
        // Eco-Score: A is best, E is worst
        switch (score.toLowerCase()) {
          case 'a': return '🟢';
          case 'b': return '🟡';
          case 'c': return '🟠';
          case 'd': return '🔴';
          case 'e': return '🔴';
          default: return '❓';
        }
      default:
        return '❓';
    }
  };

  // Generate share URL for the current scan result
  const generateShareUrl = () => {
    return `${window.location.origin}/scan-result?product=${encodeURIComponent(scanResult?.product.productName || '')}`;
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
          <div className="ml-auto">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
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

              {/* Reviews Call-to-Action */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-blue-800">See Parent Reviews</p>
                      <p className="text-xs text-blue-600">Read what other parents think</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowReviewsModal(true)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100 text-xs px-2 py-1"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Reviews
                  </Button>
                </div>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">External Scores</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 text-sm">
                    <p>Data from Open Food Facts database</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nutri-Score</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xl font-bold text-gray-800">{scanResult.nutriscore}</p>
                    <span className="text-lg">{getScoreEmoji(scanResult.nutriscore, 'nutri')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">NOVA Group</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xl font-bold text-gray-800">{scanResult.novaGroup}</p>
                    <span className="text-lg">{getScoreEmoji(scanResult.novaGroup.toString(), 'nova')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Eco-Score</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xl font-bold text-gray-800">{scanResult.ecoscore}</p>
                    <span className="text-lg">{getScoreEmoji(scanResult.ecoscore, 'eco')}</span>
                  </div>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
              <p className="text-sm text-gray-600 mb-4">
                Listed in order of quantity. First ingredient makes up the largest portion of the product.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {scanResult.product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Additives - Always show this section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Additives</h3>
              <p className="text-sm text-gray-600 mb-4">
                Substances added to preserve, enhance flavor, or improve appearance. Some may be concerning for babies.
              </p>
              {scanResult.product.additives && scanResult.product.additives.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {scanResult.product.additives.map((additive, index) => (
                    <li key={index} className="text-sm">{additive}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  ✓ No additives detected in this product
                </p>
              )}
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
      {scanResult && (
        <ShareModal
          open={showShareModal}
          onOpenChange={setShowShareModal}
          productName={scanResult.product.productName}
          shareUrl={generateShareUrl()}
        />
      )}

      {/* Reviews Modal */}
      {scanResult && (
        <ReviewsModal
          open={showReviewsModal}
          onOpenChange={setShowReviewsModal}
          productName={scanResult.product.productName}
        />
      )}
    </div>
  );
};

export default ScanResult;
