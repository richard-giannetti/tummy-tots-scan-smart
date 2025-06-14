
import { useState, useEffect, useCallback } from 'react';

export type PermissionState = 'checking' | 'granted' | 'denied' | 'prompt' | 'unavailable';

interface CameraPermissionHook {
  permissionState: PermissionState;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
  clearPermissionCache: () => void;
  error: string | null;
}

const PERMISSION_CACHE_KEY = 'camera_permission_state';
const PERMISSION_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface PermissionCache {
  state: PermissionState;
  timestamp: number;
  userAgent: string;
}

export const useCameraPermission = (): CameraPermissionHook => {
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Check if camera is supported
  const checkCameraSupport = useCallback(() => {
    const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasWebRTC = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    
    return hasUserMedia || hasWebRTC;
  }, []);

  // Load cached permission state
  const loadCachedPermission = useCallback((): PermissionState | null => {
    try {
      const cached = localStorage.getItem(PERMISSION_CACHE_KEY);
      if (!cached) return null;

      const { state, timestamp, userAgent }: PermissionCache = JSON.parse(cached);
      
      // Check if cache is expired or user agent changed (different browser/device)
      if (
        Date.now() - timestamp > PERMISSION_CACHE_EXPIRY ||
        userAgent !== navigator.userAgent
      ) {
        localStorage.removeItem(PERMISSION_CACHE_KEY);
        return null;
      }

      // Only trust 'granted' state from cache, always re-check 'denied'
      return state === 'granted' ? state : null;
    } catch (error) {
      console.warn('Failed to load cached permission:', error);
      return null;
    }
  }, []);

  // Save permission state to cache
  const cachePermissionState = useCallback((state: PermissionState) => {
    try {
      const cacheData: PermissionCache = {
        state,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      localStorage.setItem(PERMISSION_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache permission state:', error);
    }
  }, []);

  // Clear permission cache
  const clearPermissionCache = useCallback(() => {
    try {
      localStorage.removeItem(PERMISSION_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear permission cache:', error);
    }
  }, []);

  // Check current permission status
  const checkPermission = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      if (!checkCameraSupport()) {
        setIsSupported(false);
        setPermissionState('unavailable');
        return;
      }

      // First, try to load from cache
      const cachedState = loadCachedPermission();
      if (cachedState === 'granted') {
        // Verify cached 'granted' state is still valid
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          stream.getTracks().forEach(track => track.stop());
          setPermissionState('granted');
          return;
        } catch (error) {
          // Cache was wrong, permission was revoked
          clearPermissionCache();
        }
      }

      // Use Permissions API if available (not supported in iOS Safari)
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          const newState = result.state as PermissionState;
          setPermissionState(newState);
          
          if (newState === 'granted') {
            cachePermissionState(newState);
          }

          // Listen for permission changes
          result.onchange = () => {
            const updatedState = result.state as PermissionState;
            setPermissionState(updatedState);
            
            if (updatedState === 'granted') {
              cachePermissionState(updatedState);
            } else {
              clearPermissionCache();
            }
          };

          return;
        } catch (permissionError) {
          console.log('Permissions API not supported or failed:', permissionError);
        }
      }

      // Fallback for browsers without Permissions API (iOS Safari)
      // We can't know the state without asking, so default to 'prompt'
      setPermissionState('prompt');

    } catch (error: any) {
      console.error('Error checking camera permission:', error);
      setError('Failed to check camera permission');
      setPermissionState('unavailable');
    }
  }, [checkCameraSupport, loadCachedPermission, cachePermissionState, clearPermissionCache]);

  // Request camera permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      if (!checkCameraSupport()) {
        setError('Camera is not supported on this device');
        setPermissionState('unavailable');
        return false;
      }

      // Try to access camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Prefer back camera for scanning
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Success - clean up stream and update state
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState('granted');
      cachePermissionState('granted');
      
      return true;

    } catch (error: any) {
      console.error('Camera permission request failed:', error);
      
      let errorMessage = 'Failed to access camera';
      let newState: PermissionState = 'denied';

      switch (error.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          errorMessage = 'Camera access was denied. Please enable camera permissions in your browser settings.';
          newState = 'denied';
          break;
        
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          errorMessage = 'No camera found on this device.';
          newState = 'unavailable';
          break;
        
        case 'NotReadableError':
        case 'TrackStartError':
          errorMessage = 'Camera is already in use by another application.';
          newState = 'denied';
          break;
        
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
          errorMessage = 'Camera does not meet the required specifications.';
          newState = 'unavailable';
          break;
        
        case 'NotSupportedError':
          errorMessage = 'Camera access is not supported in this browser.';
          newState = 'unavailable';
          setIsSupported(false);
          break;
        
        case 'SecurityError':
          errorMessage = 'Camera access blocked due to security restrictions.';
          newState = 'denied';
          break;
        
        default:
          errorMessage = `Camera access failed: ${error.message || 'Unknown error'}`;
          newState = 'denied';
      }

      setError(errorMessage);
      setPermissionState(newState);
      
      // Clear cache on any error
      clearPermissionCache();
      
      return false;
    }
  }, [checkCameraSupport, cachePermissionState, clearPermissionCache]);

  // Initialize on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    permissionState,
    isSupported,
    requestPermission,
    checkPermission,
    clearPermissionCache,
    error
  };
};
