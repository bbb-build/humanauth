-- アクセスログ: ユーザーの個人データがクライアントに渡った証跡
-- GDPR / 個人情報保護法の「データアクセス履歴開示」対応の根幹
-- 失敗ログ（invalid_token 等）は本テーブルでは扱わない（ha_security_events で別管理）
-- Phase C で外部データ連携が始まる前にここを敷設しておかないと、過去ログが穴あきになる

CREATE TABLE IF NOT EXISTS ha_access_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES ha_oauth_clients(client_id) ON DELETE CASCADE,
  -- どの出口経由でアクセスされたか。introspect は v1.0 まで未実装だが将来用に予約
  endpoint TEXT NOT NULL CHECK (endpoint IN ('userinfo', 'token_issue', 'token_refresh', 'introspect')),
  -- そのリクエストでトークンが持っていた scope（許諾済み scope と必ずしも一致しない: ダウングレード可能性）
  scopes TEXT[] NOT NULL,
  -- 実際に返した claim 名の配列（"何が渡ったか" の証跡）。token 発行系では空配列
  claims_returned TEXT[] NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  -- 同一リクエスト内の複数イベントを束ねる識別子（将来 introspect / userinfo の連鎖を辿るため）
  request_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ユーザー画面「自分のデータが誰に渡ったか」用
CREATE INDEX IF NOT EXISTS idx_ha_access_logs_user_time ON ha_access_logs(user_id, created_at DESC);
-- クライアント別監査用
CREATE INDEX IF NOT EXISTS idx_ha_access_logs_client_time ON ha_access_logs(client_id, created_at DESC);
