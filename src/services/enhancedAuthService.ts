
import { AuthService } from './authService';
import { UsageTrackingService } from './usageTrackingService';

export class EnhancedAuthService extends AuthService {
  /**
   * Enhanced sign out that also ends the user session
   */
  static async signOutWithSessionCleanup(sessionId?: string, sessionMetrics?: { pagesVisited: number; actionsPerformed: number }) {
    try {
      // End the current session if provided
      if (sessionId && sessionMetrics) {
        await UsageTrackingService.endSession(
          sessionId, 
          sessionMetrics.pagesVisited, 
          sessionMetrics.actionsPerformed
        );
      }

      // Call the original signOut method
      return await super.signOut();
    } catch (error: any) {
      console.error('Enhanced signout error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
