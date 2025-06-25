
import { supabase } from '@/integrations/supabase/client';

export interface SessionMetrics {
  sessionId: string;
  pagesVisited: number;
  actionsPerformed: number;
}

export interface UsageStats {
  total_sessions: number;
  total_time_minutes: number;
  avg_session_duration: number;
  total_activities: number;
  last_activity: string;
  most_active_day: string;
  weekly_sessions: number;
  monthly_sessions: number;
}

export class UsageTrackingService {
  static async startSession(userId: string, deviceType?: string, browserInfo?: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('start_user_session', {
        user_uuid: userId,
        device_type_param: deviceType,
        browser_info_param: browserInfo
      });

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      console.log('Session started:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error starting session:', error);
      return null;
    }
  }

  static async endSession(sessionId: string, pagesVisited: number = 0, actionsPerformed: number = 0): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('end_user_session', {
        session_uuid: sessionId,
        pages_visited_param: pagesVisited,
        actions_performed_param: actionsPerformed
      });

      if (error) {
        console.error('Error ending session:', error);
        return false;
      }

      console.log('Session ended successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error ending session:', error);
      return false;
    }
  }

  static async logActivity(
    userId: string, 
    activityType: string, 
    sessionId?: string, 
    activityData?: any, 
    pagePath?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('log_user_activity', {
        user_uuid: userId,
        activity_type_param: activityType,
        session_uuid: sessionId,
        activity_data_param: activityData ? JSON.stringify(activityData) : null,
        page_path_param: pagePath
      });

      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error logging activity:', error);
      return false;
    }
  }

  static async getUserStats(userId: string): Promise<UsageStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_usage_stats', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error getting user stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Unexpected error getting user stats:', error);
      return null;
    }
  }

  static getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  static getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    return `${browser} on ${navigator.platform}`;
  }
}
