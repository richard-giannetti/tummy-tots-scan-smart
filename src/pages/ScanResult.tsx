
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScanService, ScanResult } from '@/services/scanService';
import { useScanTracking } from '@/hooks/useScanTracking';
import { ROUTES } from '@/constants/app';

const ScanResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recordScan } = useScanTracking();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get scan result from location state or generate mock result
    const result = location.state?.scanResult || ScanService.generateMockScanResult();
    setScanResult(result);
    setLoading(false);

    // Record the scan
    if (result) {
      recordScan(result.healthyTummiesScore);
    }
  }, [location.state, recordScan]);

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  const handleShare = () => {
    if (navigator.share && scanResult) {
      navigator.share({
        title: `Healthy Tummies Scan: ${scanResult.product.productName}`,
        text: `Score: ${scanResult.healthyTummiesScore}/100`,
        url: window.location.href,
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreMessage = (score: number, productName: string) => {
    if (score >= 80) return `Great choice! ${productName} is excellent for your baby 😊`;
    if (score >= 60) return `Good option! ${productName} is okay for your baby 🤔`;
    if (score >= 40) return `Consider alternatives to ${productName} ⚠️`;
    return `Not recommended for your baby ❌`;
  };

  if (loading || !scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header with Product Image */}
      <div className="relative">
        <img 
          src={scanResult.product.imageUrl} 
          alt={scanResult.product.productName}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center text-white hover:text-gray-200 bg-black/20 rounded-full p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center text-white hover:text-gray-200 bg-black/20 rounded-full p-2"
            >
              <Share className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h1 className="text-2xl font-bold text-white">{scanResult.product.productName}</h1>
          {scanResult.product.brand && (
            <p className="text-gray-200">{scanResult.product.brand}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Score Section */}
        <Card className="text-center">
          <CardContent className="p-6">
            <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${getScoreBgColor(scanResult.healthyTummiesScore)} flex items-center justify-center text-white relative`}>
              <div className="text-center">
                <div className="text-3xl font-bold">{scanResult.healthyTummiesScore}</div>
                <div className="text-sm opacity-90">/ 100</div>
              </div>
              {scanResult.product.nutriScore && (
                <div className="absolute -top-2 -right-2 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                  {scanResult.product.nutriScore}
                </div>
              )}
            </div>
            <h2 className={`text-xl font-bold ${getScoreColor(scanResult.healthyTummiesScore)} mb-2`}>
              Healthy Tummies Score
            </h2>
            <p className="text-gray-600 mb-4">
              {getScoreMessage(scanResult.healthyTummiesScore, scanResult.product.productName)}
            </p>
            {!scanResult.ageAppropriate && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Age Consideration Required</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warnings Section */}
        {scanResult.warnings.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Important Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scanResult.warnings.map((warning, index) => (
                  <li key={index} className="text-orange-700 text-sm flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          {/* Sugar Analysis */}
          <Collapsible>
            <CollapsibleTrigger 
              className="w-full"
              onClick={() => toggleSection('sugar')}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${scanResult.breakdown.sugarScore >= 70 ? 'bg-green-500' : scanResult.breakdown.sugarScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">Sugar Content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{scanResult.breakdown.sugarScore}/100</span>
                      {expandedSections.sugar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 bg-gray-50">
                <CardContent className="p-4">
                  <Progress value={scanResult.breakdown.sugarScore} className="mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Sugar content: {scanResult.product.nutritionalValues.sugar?.toFixed(1) || 'N/A'}g per 100g
                  </p>
                  <p className="text-xs text-gray-500">
                    Babies should have minimal added sugar to develop healthy taste preferences and prevent tooth decay.
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Salt Analysis */}
          <Collapsible>
            <CollapsibleTrigger 
              className="w-full"
              onClick={() => toggleSection('salt')}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${scanResult.breakdown.saltScore >= 70 ? 'bg-green-500' : scanResult.breakdown.saltScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">Salt Content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{scanResult.breakdown.saltScore}/100</span>
                      {expandedSections.salt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 bg-gray-50">
                <CardContent className="p-4">
                  <Progress value={scanResult.breakdown.saltScore} className="mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Salt content: {scanResult.product.nutritionalValues.salt?.toFixed(2) || 'N/A'}g per 100g
                  </p>
                  <p className="text-xs text-gray-500">
                    Baby kidneys are still developing and can't process high amounts of sodium. Keep salt intake minimal.
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Additives Analysis */}
          <Collapsible>
            <CollapsibleTrigger 
              className="w-full"
              onClick={() => toggleSection('additives')}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${scanResult.breakdown.additivesScore >= 70 ? 'bg-green-500' : scanResult.breakdown.additivesScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">Additives & Preservatives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{scanResult.breakdown.additivesScore}/100</span>
                      {expandedSections.additives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 bg-gray-50">
                <CardContent className="p-4">
                  <Progress value={scanResult.breakdown.additivesScore} className="mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    {scanResult.product.additives?.length || 0} additives detected
                  </p>
                  <p className="text-xs text-gray-500">
                    Fewer additives mean cleaner, more natural nutrition for your baby's developing system.
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Nutritional Benefits */}
          {scanResult.breakdown.nutritionalBenefits.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Nutritional Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scanResult.breakdown.nutritionalBenefits.map((benefit, index) => (
                    <li key={index} className="text-green-700 text-sm flex items-start">
                      <CheckCircle className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* BLW Placeholder Sections */}
        <div className="space-y-6">
          {/* Recipe Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Baby-Led Weaning Ideas</span>
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Coming Soon</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {['Sweet Potato Fingers', 'Banana Pancakes', 'Veggie Muffins'].map((recipe, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 opacity-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                      <div>
                        <h4 className="font-medium text-gray-700">{recipe}</h4>
                        <p className="text-sm text-gray-500">6+ months • Easy prep</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Food Introduction Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Introduction Guide</span>
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Coming Soon</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'When to start', desc: 'Age guidance for introduction' },
                  { title: 'Serving size', desc: 'Appropriate portions' },
                  { title: 'Safety tips', desc: 'How to serve safely' },
                  { title: 'Signs to watch', desc: 'Allergic reactions' }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-3 opacity-50">
                    <h4 className="font-medium text-gray-700">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scientific Backing */}
          <Collapsible>
            <CollapsibleTrigger 
              className="w-full"
              onClick={() => toggleSection('science')}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Info className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">How We Calculated This Score</span>
                    </div>
                    {expandedSections.science ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 bg-blue-50">
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <p>Our scoring is based on:</p>
                    <ul className="space-y-2 text-xs text-gray-600">
                      <li>• WHO infant feeding guidelines</li>
                      <li>• Pediatric nutrition research</li>
                      <li>• Age-appropriate food safety standards</li>
                      <li>• Allergen and additive analysis</li>
                    </ul>
                    <p className="text-xs text-gray-500 italic">
                      Always consult your pediatrician before introducing new foods.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default ScanResultScreen;
