
-- Add a unique constraint on user_id and recipe_id to support upsert operations
ALTER TABLE public.recipe_interactions 
ADD CONSTRAINT recipe_interactions_user_recipe_unique 
UNIQUE (user_id, recipe_id);
