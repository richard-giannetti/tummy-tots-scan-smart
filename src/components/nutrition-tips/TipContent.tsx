
import React from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAgeBadgeColor } from '@/utils/tipUtils';

interface Tip {
  tip_id: number;
  tip_title: string;
  tip_description: string;
  tip_age: string;
}

interface TipContentProps {
  currentTip: Tip;
  isExpanded: boolean;
  availableTipsCount: number;
  onToggleExpanded: () => void;
  onMarkAsRead: () => void;
  onGetNewTip: () => void;
}

export const TipContent = ({
  currentTip,
  isExpanded,
  availableTipsCount,
  onToggleExpanded,
  onMarkAsRead,
  onGetNewTip
}: TipContentProps) => {
  return (
    <>
      {/* Collapsed/Expanded State */}
      <div 
        className={`p-4 cursor-pointer transition-all duration-300 ${!isExpanded ? 'hover:bg-gray-50' : ''}`}
        onClick={onToggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={`text-xs border ${getAgeBadgeColor(currentTip.tip_age)}`}>
                {currentTip.tip_age}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
              {currentTip.tip_title}
            </h3>
            {!isExpanded && (
              <p className="text-xs text-gray-500 mt-1">Tap to read more</p>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 space-y-4">
            <div className="max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentTip.tip_description}
              </p>
            </div>
            
            <div className="flex items-center justify-end pt-2">
              <div className="flex space-x-2">
                {availableTipsCount > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGetNewTip();
                    }}
                    className="text-xs"
                  >
                    New Tip
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark as Read
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
