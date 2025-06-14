
-- First, let's check if _id is the primary key or add unique constraint
-- Add unique constraint to recipes._id if it's not already unique
ALTER TABLE public.recipes ADD CONSTRAINT recipes_id_unique UNIQUE (_id);

-- Now add the foreign key constraint between recipe_favorites and recipes tables
ALTER TABLE public.recipe_favorites 
ADD CONSTRAINT fk_recipe_favorites_recipe_id 
FOREIGN KEY (recipe_id) REFERENCES public.recipes(_id);

-- Add index for better performance on the foreign key
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_recipe_id ON public.recipe_favorites(recipe_id);
