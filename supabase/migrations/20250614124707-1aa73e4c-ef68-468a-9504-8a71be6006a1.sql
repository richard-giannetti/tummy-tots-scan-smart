
-- Create a table for favorite recipes
CREATE TABLE public.recipe_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);

-- Add Row Level Security (RLS)
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
