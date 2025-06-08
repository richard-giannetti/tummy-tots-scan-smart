
import React from 'react';

interface DemoScanSectionProps {
  onTestScan: () => void;
}

const DemoScanSection: React.FC<DemoScanSectionProps> = ({ onTestScan }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-purple-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Demo Mode</h3>
      <p className="text-gray-600 text-sm text-center mb-4">
        Can't scan right now? Try our demo with sample data
      </p>
      <button
        onClick={onTestScan}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
      >
        Try Demo Scan
      </button>
    </div>
  );
};

export default DemoScanSection;
