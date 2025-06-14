
-- Add Row Level Security (RLS) to recipe_favorites table
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.recipe_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own favorites
CREATE POLICY "Users can create their own favorites" 
  ON public.recipe_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON public.recipe_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);
