-- Login with Humanary: OAuth 2.1 / OIDC Provider基盤
-- 既存ha_apps（reCAPTCHA型ウィジェット）とは独立した新テーブル群
-- World ID nullifier_hashは固定action "humanary-login-v1"の下で発行され、
-- Humanary独自user_idと1:1で紐付く（横断グラフ保有の根幹）

-- ============================================================
-- ha_users: Humanary独自ユーザー本体
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- World IDの固定action "humanary-login-v1" 下のnullifier_hash
  -- これがあるからこそ「同一人物が複数のクライアントで認証」を検出できる
  nullifier_hash TEXT NOT NULL UNIQUE,
  -- 公開ハンドル（C案ハイブリッド: デフォルト自動生成、後から変更可）
  handle TEXT NOT NULL UNIQUE,
  -- 自動生成ハンドルか、ユーザーが任意設定したカスタムハンドルか
  handle_is_custom BOOLEAN NOT NULL DEFAULT false,
  display_name TEXT,
  avatar_url TEXT,
  -- 任意項目。World IDからは取れないのでユーザーが自発的に登録した分のみ
  email TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  verification_level TEXT NOT NULL DEFAULT 'orb' CHECK (verification_level IN ('orb', 'device')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ha_users_handle ON ha_users(handle);
CREATE INDEX IF NOT EXISTS idx_ha_users_nullifier ON ha_users(nullifier_hash);

-- ハンドル形式: 自動生成は u_<8hex>、カスタムは英数字とアンダースコア3-30字
ALTER TABLE ha_users ADD CONSTRAINT ha_users_handle_format
  CHECK (handle ~ '^[a-zA-Z0-9_]{3,30}$');

-- ============================================================
-- ha_oauth_clients: 「Login with Humanary」を組み込むクライアントアプリ
-- 既存 ha_apps（reCAPTCHA型）とは別の概念
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_oauth_clients (
  client_id TEXT PRIMARY KEY,
  -- bcrypt等でハッシュ化したsecret。confidential clientのみ。
  -- public client（SPA等）はnullでPKCEのみで認可する
  client_secret_hash TEXT,
  client_type TEXT NOT NULL DEFAULT 'public' CHECK (client_type IN ('public', 'confidential')),
  name TEXT NOT NULL,
  logo_url TEXT,
  homepage_url TEXT,
  -- 完全一致比較するredirect URI候補
  redirect_uris TEXT[] NOT NULL DEFAULT '{}',
  -- このクライアントが要求できるscope上限
  allowed_scopes TEXT[] NOT NULL DEFAULT ARRAY['openid', 'profile', 'verified_human'],
  -- アプリ所有者（Humanaryユーザー）。owner自身が管理画面から登録する
  owner_user_id UUID REFERENCES ha_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ha_oauth_clients_owner ON ha_oauth_clients(owner_user_id);

-- ============================================================
-- ha_oauth_codes: 認可コード（短命、一度限り）
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_oauth_codes (
  -- code_hash: 平文codeはレスポンスのみ、DBにはSHA-256ハッシュを保存
  code_hash TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES ha_oauth_clients(client_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  scopes TEXT[] NOT NULL,
  redirect_uri TEXT NOT NULL,
  -- PKCE必須
  pkce_code_challenge TEXT NOT NULL,
  pkce_method TEXT NOT NULL DEFAULT 'S256' CHECK (pkce_method IN ('S256', 'plain')),
  -- OIDC nonce（id_tokenに埋め込んでリプレイ防止）
  nonce TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ha_oauth_codes_expires ON ha_oauth_codes(expires_at);

-- ============================================================
-- ha_oauth_tokens: アクセストークン / リフレッシュトークン
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_oauth_tokens (
  -- token_hash: 平文tokenはレスポンスのみ、DBにはSHA-256ハッシュを保存
  token_hash TEXT PRIMARY KEY,
  token_type TEXT NOT NULL CHECK (token_type IN ('access', 'refresh')),
  client_id TEXT NOT NULL REFERENCES ha_oauth_clients(client_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  scopes TEXT[] NOT NULL,
  -- refresh tokenローテーション用: 親tokenが消費されたら子tokenも無効化
  parent_token_hash TEXT REFERENCES ha_oauth_tokens(token_hash) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ha_oauth_tokens_user ON ha_oauth_tokens(user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ha_oauth_tokens_client ON ha_oauth_tokens(client_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ha_oauth_tokens_expires ON ha_oauth_tokens(expires_at) WHERE revoked_at IS NULL;

-- ============================================================
-- ha_user_sessions: humanary.world側のSSOセッション
-- 一度Humanaryでログインすれば複数クライアントで同意のみで通せる
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_user_sessions (
  -- session_id_hash: Cookie値はレスポンスのみ、DBにはハッシュを保存
  session_id_hash TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ha_user_sessions_user ON ha_user_sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ha_user_sessions_expires ON ha_user_sessions(expires_at) WHERE revoked_at IS NULL;

-- ============================================================
-- ha_oauth_consents: 同意の記憶（同一クライアントへの2回目以降は同意画面スキップ）
-- ============================================================
CREATE TABLE IF NOT EXISTS ha_oauth_consents (
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES ha_oauth_clients(client_id) ON DELETE CASCADE,
  scopes TEXT[] NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, client_id)
);

-- ============================================================
-- ハンドル自動生成関数: u_<nullifier頭8文字>
-- 衝突時はランダム接尾辞をつけてリトライ
-- ============================================================
CREATE OR REPLACE FUNCTION ha_generate_handle(p_nullifier TEXT)
RETURNS TEXT AS $$
DECLARE
  v_base TEXT;
  v_candidate TEXT;
  v_suffix TEXT;
BEGIN
  -- 0xを除去して頭8文字
  v_base := 'u_' || substring(regexp_replace(p_nullifier, '^0x', ''), 1, 8);
  v_candidate := v_base;

  -- 衝突したらランダム4文字を付加してリトライ（最大5回）
  FOR i IN 1..5 LOOP
    IF NOT EXISTS (SELECT 1 FROM ha_users WHERE handle = v_candidate) THEN
      RETURN v_candidate;
    END IF;
    v_suffix := substring(md5(random()::text || clock_timestamp()::text), 1, 4);
    v_candidate := v_base || '_' || v_suffix;
  END LOOP;

  -- それでも衝突するならuuidの頭でユニーク確保
  RETURN 'u_' || substring(replace(gen_random_uuid()::text, '-', ''), 1, 12);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- updated_atトリガー
-- ============================================================
CREATE OR REPLACE FUNCTION ha_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ha_users_updated_at ON ha_users;
CREATE TRIGGER trg_ha_users_updated_at
  BEFORE UPDATE ON ha_users
  FOR EACH ROW EXECUTE FUNCTION ha_set_updated_at();

DROP TRIGGER IF EXISTS trg_ha_oauth_clients_updated_at ON ha_oauth_clients;
CREATE TRIGGER trg_ha_oauth_clients_updated_at
  BEFORE UPDATE ON ha_oauth_clients
  FOR EACH ROW EXECUTE FUNCTION ha_set_updated_at();

-- ============================================================
-- 期限切れデータの掃除関数（cronから呼ぶ）
-- ============================================================
CREATE OR REPLACE FUNCTION ha_cleanup_expired_oauth()
RETURNS void AS $$
BEGIN
  -- 認可コードは短命なので消費済み or 期限切れを削除
  DELETE FROM ha_oauth_codes
    WHERE expires_at < now() OR consumed_at IS NOT NULL;

  -- 失効済みトークンは30日後に削除（監査ログとして残す期間）
  DELETE FROM ha_oauth_tokens
    WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '30 days')
       OR (expires_at < now() - interval '30 days');

  -- セッションは失効から7日後に削除
  DELETE FROM ha_user_sessions
    WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '7 days')
       OR (expires_at < now() - interval '7 days');
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE ha_users IS 'Humanary独自ユーザー本体。nullifier_hashは固定action humanary-login-v1の下で発行';
COMMENT ON TABLE ha_oauth_clients IS '「Login with Humanary」を組み込む埋込先アプリ。既存ha_apps（reCAPTCHA型）とは独立';
COMMENT ON TABLE ha_oauth_codes IS 'OAuth認可コード（短命、code_hash保存）';
COMMENT ON TABLE ha_oauth_tokens IS 'access/refreshトークン（token_hash保存、ローテーション対応）';
COMMENT ON TABLE ha_user_sessions IS 'humanary.world側SSOセッション（同意済みクライアントは画面スキップで通せる）';
COMMENT ON TABLE ha_oauth_consents IS 'クライアントごとの同意記録（2回目以降の同意画面スキップ用）';
