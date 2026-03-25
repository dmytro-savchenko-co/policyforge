-- profiles: links to supabase auth, tracks plan and usage
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  generation_count INTEGER NOT NULL DEFAULT 0,
  generation_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- generated_policies: user's saved policies
CREATE TABLE generated_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL,
  title TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  form_data JSONB NOT NULL,
  generated_html TEXT NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  embed_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_policies ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS policies for generated_policies
CREATE POLICY "Users can read own policies" ON generated_policies
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own policies" ON generated_policies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own policies" ON generated_policies
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own policies" ON generated_policies
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Indexes
CREATE INDEX idx_policies_user_id ON generated_policies(user_id);
CREATE INDEX idx_policies_created_at ON generated_policies(created_at DESC);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
