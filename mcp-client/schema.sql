-- Create content plans table
CREATE TABLE IF NOT EXISTS content_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    topic TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content ideas table
CREATE TABLE IF NOT EXISTS content_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES content_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAUlT 'idea',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime
INSERT INTO realtime.channels (pattern, description, enabled)
VALUES ('plan:%', 'Realtime updates for content plans', true)
ON CONFLICT DO NOTHING;

-- Trigger Function for realtime updates
CREATE OR REPLACE FUNCTION notify_idea_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM realtime.publish(
      'plan:' || NEW.plan_id::text,
      'idea_inserted',
      jsonb_build_object('action', 'insert', 'idea', row_to_json(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM realtime.publish(
      'plan:' || NEW.plan_id::text,
      'idea_updated',
      jsonb_build_object('action', 'update', 'idea', row_to_json(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM realtime.publish(
      'plan:' || OLD.plan_id::text,
      'idea_deleted',
      jsonb_build_object('action', 'delete', 'idea_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Map trigger to table
DROP TRIGGER IF EXISTS idea_realtime ON content_ideas;
CREATE TRIGGER idea_realtime
  AFTER INSERT OR UPDATE OR DELETE ON content_ideas
  FOR EACH ROW
  EXECUTE FUNCTION notify_idea_changes();
