-- Migration 00002: Extend schema for full SaaS features
-- Run this in your Supabase SQL Editor

-- ============================================================
-- 1. Extend profiles table
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add unique constraint on subscriptions.user_id for upsert operations
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);

-- ============================================================
-- 2. Extend draw_periods table (create if not exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS draw_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'drawn', 'canceled')),
  total_pool NUMERIC DEFAULT 0,
  jackpot_rollover NUMERIC DEFAULT 0,
  winning_numbers INTEGER[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. Create draw_entries table (score snapshot at draw time)
-- ============================================================
CREATE TABLE IF NOT EXISTS draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_period_id UUID NOT NULL REFERENCES draw_periods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(draw_period_id, user_id)
);

-- ============================================================
-- 4. Create winners table
-- ============================================================
CREATE TABLE IF NOT EXISTS winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_period_id UUID NOT NULL REFERENCES draw_periods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_count INTEGER NOT NULL CHECK (match_count >= 3 AND match_count <= 5),
  payout_amount NUMERIC NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'rejected')),
  proof_url TEXT,
  admin_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. RLS Policies
-- ============================================================
ALTER TABLE draw_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- draw_periods: everyone can read
CREATE POLICY "Anyone can read draw periods" ON draw_periods FOR SELECT USING (true);

-- draw_entries: users can read own entries
CREATE POLICY "Users can read own draw entries" ON draw_entries FOR SELECT USING (auth.uid() = user_id);

-- winners: users can read own winnings
CREATE POLICY "Users can read own winnings" ON winners FOR SELECT USING (auth.uid() = user_id);

-- charities: everyone can read
CREATE POLICY "Anyone can read charities" ON charities FOR SELECT USING (true);

-- subscriptions: users can read own
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- golf_scores: users can read/insert/delete own
CREATE POLICY "Users can read own scores" ON golf_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON golf_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON golf_scores FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. Auto-create profile on signup trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, subscription_status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    'user',
    'inactive'
  );
  
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (new.id, 'inactive');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
