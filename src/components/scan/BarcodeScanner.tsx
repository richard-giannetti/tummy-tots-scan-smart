
import React from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

interface BarcodeScannerProps {
  isCameraActive: boolean;
  scannedCode: string;
  scanError: string;
  hasPermission: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onScanSuccess: (code: string) => void;
  onScanError: (error: any) => void;
  onProcessScan: () => void;
  onScanAgain: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isCameraActive,
  scannedCode,
  scanError,
  hasPermission,
  onStartCamera,
  onStopCamera,
  onScanSuccess,
  onScanError,
  onProcessScan,
  onScanAgain
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Scan Barcode</h2>
      
      {!isCameraActive && !scannedCode && (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
            <Camera className="w-12 h-12 text-pink-600" />
          </div>
          <p className="text-gray-600">Position the barcode within the camera view</p>
          <button
            onClick={onStartCamera}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            Start Camera
          </button>
        </div>
      )}

      {isCameraActive && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <BarcodeScannerComponent
              width="100%"
              height="100%"
              onUpdate={(err, result) => {
                if (result) {
                  onScanSuccess(result.getText());
                } else if (err) {
                  onScanError(err);
                }
              }}
            />
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-pink-500 rounded-lg"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Position barcode in the highlighted area</p>
            <button
              onClick={onStopCamera}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Stop Camera
            </button>
          </div>
        </div>
      )}

      {scanError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-700 text-sm">{scanError}</p>
          <button
            onClick={onStartCamera}
            className="mt-2 text-red-600 underline text-sm hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {scannedCode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Barcode Detected!</span>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Scanned Code:</p>
            <p className="font-mono text-lg font-bold text-gray-800 bg-white px-3 py-2 rounded border">
              {scannedCode}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onProcessScan}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Analyze Product
            </button>
            <button
              onClick={onScanAgain}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
