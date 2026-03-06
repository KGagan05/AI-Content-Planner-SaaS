-- Enable Row Level Security (RLS) on the tables
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- content_plans policies
DROP POLICY IF EXISTS "Users can view their own or public plans" ON content_plans;
CREATE POLICY "Users can view their own or public plans" 
ON content_plans FOR SELECT 
TO authenticated, anon
USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert their own plans" ON content_plans;
CREATE POLICY "Users can insert their own plans" 
ON content_plans FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own plans" ON content_plans;
CREATE POLICY "Users can update their own plans" 
ON content_plans FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own plans" ON content_plans;
CREATE POLICY "Users can delete their own plans" 
ON content_plans FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- content_ideas policies
DROP POLICY IF EXISTS "Users can view ideas of accessible plans" ON content_ideas;
CREATE POLICY "Users can view ideas of accessible plans" 
ON content_ideas FOR SELECT 
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM content_plans 
    WHERE content_plans.id = content_ideas.plan_id 
    AND (content_plans.user_id = auth.uid() OR content_plans.is_public = true)
  )
);

DROP POLICY IF EXISTS "Users can insert ideas to their plans" ON content_ideas;
CREATE POLICY "Users can insert ideas to their plans" 
ON content_ideas FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM content_plans 
    WHERE content_plans.id = content_ideas.plan_id 
    AND content_plans.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update ideas of their plans" ON content_ideas;
CREATE POLICY "Users can update ideas of their plans" 
ON content_ideas FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM content_plans 
    WHERE content_plans.id = content_ideas.plan_id 
    AND content_plans.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete ideas of their plans" ON content_ideas;
CREATE POLICY "Users can delete ideas of their plans" 
ON content_ideas FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM content_plans 
    WHERE content_plans.id = content_ideas.plan_id 
    AND content_plans.user_id = auth.uid()
  )
);
