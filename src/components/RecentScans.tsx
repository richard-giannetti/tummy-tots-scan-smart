
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

export const RecentScans = () => {
  // Mock data for recent scans
  const recentScans = [
    {
      id: 1,
      productName: "Organic Baby Cereal",
      score: 92,
      date: "2 hours ago",
      image: "🥣"
    },
    {
      id: 2,
      productName: "Apple Puree",
      score: 88,
      date: "Yesterday",
      image: "🍎"
    },
    {
      id: 3,
      productName: "Baby Yogurt",
      score: 76,
      date: "2 days ago",
      image: "🥛"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  if (recentScans.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No scans yet</h3>
        <p className="text-gray-600 text-sm">Start scanning foods to see your history here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Recent Scans
        </h3>
        <button className="text-sm text-pink-500 hover:text-pink-600 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recentScans.map((scan) => (
          <div
            key={scan.id}
            className={`flex items-center space-x-4 p-3 rounded-xl border-2 ${getScoreBorder(scan.score)} hover:shadow-sm transition-all cursor-pointer`}
          >
            <div className="text-2xl">{scan.image}</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 text-sm">{scan.productName}</h4>
              <p className="text-xs text-gray-500">{scan.date}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(scan.score)}`}>
              {scan.score}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
