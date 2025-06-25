
-- Create a comprehensive user sessions table for tracking app usage
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  pages_visited INTEGER DEFAULT 0,
  actions_performed INTEGER DEFAULT 0,
  device_type TEXT,
  browser_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an activity log table for detailed usage tracking
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- 'page_view', 'recipe_view', 'food_introduced', 'scan_performed', 'search', etc.
  activity_data JSONB, -- Additional context data
  page_path TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_user_sessions_user_id_start ON public.user_sessions(user_id, session_start DESC);
CREATE INDEX idx_user_activities_user_id_type ON public.user_activities(user_id, activity_type);
CREATE INDEX idx_user_activities_timestamp ON public.user_activities(timestamp DESC);
CREATE INDEX idx_user_activities_session_id ON public.user_activities(session_id);

-- Enable RLS on the new tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.user_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to start a new user session (fixed parameter order)
CREATE OR REPLACE FUNCTION public.start_user_session(
  user_uuid UUID,
  device_type_param TEXT DEFAULT NULL,
  browser_info_param TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.user_sessions (user_id, device_type, browser_info)
  VALUES (user_uuid, device_type_param, browser_info_param)
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Function to end a user session (fixed parameter order)
CREATE OR REPLACE FUNCTION public.end_user_session(
  session_uuid UUID,
  pages_visited_param INTEGER DEFAULT 0,
  actions_performed_param INTEGER DEFAULT 0
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
  duration INTEGER;
BEGIN
  -- Get session start time
  SELECT session_start INTO start_time 
  FROM public.user_sessions 
  WHERE id = session_uuid;
  
  -- Calculate duration in minutes
  duration := EXTRACT(EPOCH FROM (now() - start_time)) / 60;
  
  -- Update session with end time and metrics
  UPDATE public.user_sessions 
  SET 
    session_end = now(),
    duration_minutes = duration,
    pages_visited = pages_visited_param,
    actions_performed = actions_performed_param
  WHERE id = session_uuid;
END;
$$;

-- Function to log user activity (fixed parameter order)
CREATE OR REPLACE FUNCTION public.log_user_activity(
  user_uuid UUID,
  activity_type_param TEXT,
  session_uuid UUID DEFAULT NULL,
  activity_data_param JSONB DEFAULT NULL,
  page_path_param TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activities (
    user_id, 
    session_id, 
    activity_type, 
    activity_data, 
    page_path
  )
  VALUES (
    user_uuid, 
    session_uuid, 
    activity_type_param, 
    activity_data_param, 
    page_path_param
  );
END;
$$;

-- Enhanced function to get user usage statistics
CREATE OR REPLACE FUNCTION public.get_user_usage_stats(user_uuid UUID)
RETURNS TABLE(
  total_sessions INTEGER,
  total_time_minutes INTEGER,
  avg_session_duration NUMERIC,
  total_activities INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE,
  most_active_day TEXT,
  weekly_sessions INTEGER,
  monthly_sessions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT s.id)::INTEGER as total_sessions,
    COALESCE(SUM(s.duration_minutes), 0)::INTEGER as total_time_minutes,
    COALESCE(AVG(s.duration_minutes), 0) as avg_session_duration,
    COUNT(DISTINCT a.id)::INTEGER as total_activities,
    MAX(a.timestamp) as last_activity,
    TO_CHAR(MAX(a.timestamp), 'Day') as most_active_day,
    COUNT(DISTINCT CASE WHEN s.session_start >= CURRENT_DATE - INTERVAL '7 days' THEN s.id END)::INTEGER as weekly_sessions,
    COUNT(DISTINCT CASE WHEN s.session_start >= CURRENT_DATE - INTERVAL '30 days' THEN s.id END)::INTEGER as monthly_sessions
  FROM public.user_sessions s
  LEFT JOIN public.user_activities a ON s.user_id = a.user_id
  WHERE s.user_id = user_uuid;
END;
$$;

-- Add cleanup function for old activities (optional)
CREATE OR REPLACE FUNCTION public.cleanup_old_activities()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete activities older than 6 months
  DELETE FROM public.user_activities 
  WHERE timestamp < CURRENT_DATE - INTERVAL '6 months';
  
  -- Delete sessions older than 6 months
  DELETE FROM public.user_sessions 
  WHERE session_start < CURRENT_DATE - INTERVAL '6 months';
END;
$$;
