-- 顧客ごとに独立したWorld IDアプリをプロビジョニングする設計への移行
-- rp_id: 顧客固有のRP ID（rp_xxx形式）— 検証APIで使用
-- dev_portal_app_id: Developer Portal上のアプリID（app_xxx形式）— 管理操作で使用

ALTER TABLE ha_apps ADD COLUMN IF NOT EXISTS dev_portal_app_id TEXT;

-- action_nameのデフォルトを"verify"に（各アプリが独立したWorld IDを持つため固定名で十分）
COMMENT ON COLUMN ha_apps.dev_portal_app_id IS 'World Developer Portal app ID (app_xxx). Used for management API calls.';
COMMENT ON COLUMN ha_apps.rp_id IS 'World ID RP ID (rp_xxx). Used in V4 verify endpoint.';
