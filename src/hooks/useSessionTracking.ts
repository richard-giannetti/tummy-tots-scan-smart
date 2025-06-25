import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UsageTrackingService } from '@/services/usageTrackingService';
import { useLocation } from 'react-router-dom';

export const useSessionTracking = () => {
  const { user } = useAuth();
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const [sessionMetrics, setSessionMetrics] = useState({
    pagesVisited: 0,
    actionsPerformed: 0
  });

  // Start session when user logs in
  useEffect(() => {
    if (user && !sessionIdRef.current) {
      const startSession = async () => {
        const deviceType = UsageTrackingService.getDeviceType();
        const browserInfo = UsageTrackingService.getBrowserInfo();
        
        const sessionId = await UsageTrackingService.startSession(
          user.id, 
          deviceType, 
          browserInfo
        );
        
        if (sessionId) {
          sessionIdRef.current = sessionId;
          console.log('Session tracking started:', sessionId);
        }
      };

      startSession();
    }
  }, [user]);

  // Track page visits
  useEffect(() => {
    if (user && sessionIdRef.current) {
      setSessionMetrics(prev => ({
        ...prev,
        pagesVisited: prev.pagesVisited + 1
      }));

      // Log page view activity
      UsageTrackingService.logActivity(
        user.id,
        'page_view',
        sessionIdRef.current,
        { route: location.pathname },
        location.pathname
      );
    }
  }, [location.pathname, user]);

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        // Use navigator.sendBeacon for reliable delivery during page unload
        const endSessionData = {
          session_uuid: sessionIdRef.current,
          pages_visited_param: sessionMetrics.pagesVisited,
          actions_performed_param: sessionMetrics.actionsPerformed
        };

        // Try to use fetch with keepalive, fallback to sendBeacon
        try {
          fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://rbmlsgtuuslwddgfnfqd.supabase.co'}/rest/v1/rpc/end_user_session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibWxzZ3R1dXNsd2RkZ2ZuZnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzAwODQsImV4cCI6MjA2NDEwNjA4NH0.Gb4txUm0XrQWnUVt-bTyaN5KQ8rFyFlh0AGOd-FcbEE'
            },
            body: JSON.stringify(endSessionData),
            keepalive: true
          });
        } catch (error) {
          console.error('Error ending session on unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionMetrics]);

  const trackAction = async (actionType: string, actionData?: any) => {
    if (user && sessionIdRef.current) {
      setSessionMetrics(prev => ({
        ...prev,
        actionsPerformed: prev.actionsPerformed + 1
      }));

      await UsageTrackingService.logActivity(
        user.id,
        actionType,
        sessionIdRef.current,
        actionData,
        location.pathname
      );
    }
  };

  const endSession = async () => {
    if (sessionIdRef.current) {
      await UsageTrackingService.endSession(
        sessionIdRef.current,
        sessionMetrics.pagesVisited,
        sessionMetrics.actionsPerformed
      );
      sessionIdRef.current = null;
      setSessionMetrics({ pagesVisited: 0, actionsPerformed: 0 });
    }
  };

  return {
    sessionId: sessionIdRef.current,
    sessionMetrics,
    trackAction,
    endSession
  };
};
