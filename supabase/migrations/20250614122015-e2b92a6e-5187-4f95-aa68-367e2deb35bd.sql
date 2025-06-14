
-- Create a table to track recipe interactions (tried recipes, ratings, etc.)
CREATE TABLE public.recipe_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_profile_id UUID,
  recipe_id TEXT NOT NULL,
  tried BOOLEAN NOT NULL DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tried_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.recipe_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe interactions
CREATE POLICY "Users can view their own recipe interactions" 
  ON public.recipe_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipe interactions" 
  ON public.recipe_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipe interactions" 
  ON public.recipe_interactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipe interactions" 
  ON public.recipe_interactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX idx_recipe_interactions_user_recipe ON public.recipe_interactions(user_id, recipe_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.recipe_interactions 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
