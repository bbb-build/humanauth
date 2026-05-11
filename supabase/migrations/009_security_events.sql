-- セキュリティイベント: ユーザー特定できない失敗試行・異常イベント
-- ha_access_logs と分離する理由:
--   1. user_id 必須制約を綺麗に保てる（成功ログは確実にユーザー紐づき）
--   2. 用途・保存期間・閲覧権限が違う
--      - ha_access_logs:  GDPR 開示用途、ユーザーが自分で閲覧可、長期保存
--      - ha_security_events: 監視・ブルートフォース検出用、運営のみ閲覧、リテンション短め想定
--   3. ユーザー画面のクエリで `WHERE user_id IS NOT NULL` を書かずに済む

CREATE TABLE IF NOT EXISTS ha_security_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'invalid_token',     -- userinfo / token 系で不正トークン
    'expired_token',     -- 期限切れトークン
    'unknown_client',    -- 存在しない client_id
    'invalid_client',    -- client_secret 不一致等
    'invalid_grant',     -- code / refresh_token の検証失敗
    'rate_limited',      -- レート制限ヒット
    'consent_denied'     -- ユーザーが consent 拒否
  )),
  -- 特定できる範囲のメタデータ。NULL 許容
  client_id TEXT REFERENCES ha_oauth_clients(client_id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  -- イベント固有の追加情報（reason, error_description 等を JSON で）
  error_detail JSONB,
  -- ha_access_logs と同じ request_id を共有可能（成功/失敗の関連付け）
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 種別ごとの傾向監視
CREATE INDEX IF NOT EXISTS idx_ha_security_events_type_time ON ha_security_events(event_type, created_at DESC);
-- IP ベースのブルートフォース検出
CREATE INDEX IF NOT EXISTS idx_ha_security_events_ip_time ON ha_security_events(ip_address, created_at DESC);
