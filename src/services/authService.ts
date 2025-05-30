
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Authentication service for handling user login, signup, and logout
 */
export class AuthService {
  /**
   * Sign up a new user with immediate access (no email verification)
   */
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting signup for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          // Disable email confirmation for immediate access
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        console.error('AuthService: Signup error:', error);
        return { success: false, error: error.message };
      }

      // Check if user needs email confirmation
      if (authData.user && !authData.session) {
        return { success: false, error: 'Please check your email to confirm your account before signing in.' };
      }

      console.log('AuthService: Signup successful for:', authData.user?.email);
      return { success: true, user: authData.user || undefined };
    } catch (error: any) {
      console.error('AuthService: Unexpected signup error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting login for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('AuthService: Login error:', error);
        return { success: false, error: error.message };
      }

      console.log('AuthService: Login successful for:', authData.user?.email);
      return { success: true, user: authData.user };
    } catch (error: any) {
      console.error('AuthService: Unexpected login error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      console.log('AuthService: Signing out user');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('AuthService: Signout error:', error);
        return { success: false, error: error.message };
      }

      console.log('AuthService: Signout successful');
      return { success: true };
    } catch (error: any) {
      console.error('AuthService: Unexpected signout error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Get the current user session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthService: Session retrieval error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, session, user: session?.user };
    } catch (error: any) {
      console.error('AuthService: Unexpected session error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Mark onboarding as completed for the current user
   */
  static async completeOnboarding(): Promise<AuthResponse> {
    try {
      console.log('AuthService: Marking onboarding as completed');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('AuthService: No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('AuthService: Error updating onboarding status:', error);
        return { success: false, error: error.message };
      }

      console.log('AuthService: Onboarding completed successfully');
      return { success: true };
    } catch (error: any) {
      console.error('AuthService: Unexpected error completing onboarding:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Get user profile data including onboarding status
   */
  static async getUserProfile(): Promise<AuthResponse & { profile?: any }> {
    try {
      console.log('AuthService: Fetching user profile');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('AuthService: No authenticated user found');
        return { success: false, error: 'No authenticated user found' };
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('AuthService: Error fetching user profile:', error);
        return { success: false, error: error.message };
      }

      console.log('AuthService: Profile fetched successfully');
      return { success: true, user, profile };
    } catch (error: any) {
      console.error('AuthService: Unexpected error fetching profile:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
}
