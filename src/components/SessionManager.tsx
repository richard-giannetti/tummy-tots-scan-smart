
import React from 'react';
import { useSessionTracking } from '@/hooks/useSessionTracking';

export const SessionManager: React.FC = () => {
  // This component just initializes session tracking
  useSessionTracking();
  
  return null; // This component doesn't render anything
};
