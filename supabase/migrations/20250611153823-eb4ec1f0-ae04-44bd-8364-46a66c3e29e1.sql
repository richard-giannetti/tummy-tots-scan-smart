
-- Let's check what's in the tips table
SELECT * FROM tips LIMIT 5;

-- Also check the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tips' AND table_schema = 'public'
ORDER BY ordinal_position;
