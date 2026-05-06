-- HumanAuth: World ID認証マネージドゲートウェイ
-- 既存Supabaseプロジェクトに相乗り（ha_ prefix）

-- アプリ登録
CREATE TABLE ha_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rp_id TEXT NOT NULL,
  signing_key_encrypted TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  mau_current_month INTEGER DEFAULT 0,
  mau_reset_at TIMESTAMPTZ DEFAULT date_trunc('month', now()) + interval '1 month',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- APIキー（ハッシュのみ保存）
CREATE TABLE ha_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES ha_apps(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT 'Default',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_ha_api_keys_hash ON ha_api_keys(key_hash) WHERE is_active = true;

-- Nullifier保存（重複検出）
CREATE TABLE ha_nullifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES ha_apps(id) ON DELETE CASCADE,
  nullifier_hash TEXT NOT NULL,
  action TEXT NOT NULL,
  verification_level TEXT DEFAULT 'orb',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(app_id, nullifier_hash, action)
);

CREATE INDEX idx_ha_nullifiers_lookup ON ha_nullifiers(app_id, nullifier_hash);

-- 認証ログ
CREATE TABLE ha_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES ha_apps(id) ON DELETE CASCADE,
  nullifier_hash TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT '',
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ha_logs_app_time ON ha_verification_logs(app_id, created_at DESC);

-- MAUトラッキング（月間ユニークユーザー）
CREATE TABLE ha_mau_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES ha_apps(id) ON DELETE CASCADE,
  nullifier_hash TEXT NOT NULL,
  month DATE NOT NULL DEFAULT date_trunc('month', now())::date,
  UNIQUE(app_id, nullifier_hash, month)
);

CREATE INDEX idx_ha_mau_app_month ON ha_mau_tracking(app_id, month);

-- MAUインクリメント関数（upsert + カウント更新）
CREATE OR REPLACE FUNCTION ha_increment_mau(p_app_id UUID, p_nullifier TEXT)
RETURNS void AS $$
DECLARE
  v_month DATE := date_trunc('month', now())::date;
  v_is_new BOOLEAN;
BEGIN
  INSERT INTO ha_mau_tracking (app_id, nullifier_hash, month)
  VALUES (p_app_id, p_nullifier, v_month)
  ON CONFLICT (app_id, nullifier_hash, month) DO NOTHING
  RETURNING true INTO v_is_new;

  IF v_is_new THEN
    UPDATE ha_apps
    SET mau_current_month = mau_current_month + 1,
        updated_at = now()
    WHERE id = p_app_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 月次MAUリセット（cronで毎月1日に実行）
CREATE OR REPLACE FUNCTION ha_reset_monthly_mau()
RETURNS void AS $$
BEGIN
  UPDATE ha_apps SET mau_current_month = 0, mau_reset_at = date_trunc('month', now()) + interval '1 month';
END;
$$ LANGUAGE plpgsql;
