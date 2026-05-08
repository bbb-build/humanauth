-- Google Analytics方式への移行: 開発者はApp Name + Website URLだけで登録
-- HumanAuthのRP ID / Signing Keyを全アプリで共有、action_nameで差別化

ALTER TABLE ha_apps ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE ha_apps ADD COLUMN IF NOT EXISTS action_name TEXT;

-- action_nameはアプリごとに一意
CREATE UNIQUE INDEX IF NOT EXISTS idx_ha_apps_action_name ON ha_apps(action_name) WHERE action_name IS NOT NULL;

-- 新規アプリはウィジェットをデフォルト有効
ALTER TABLE ha_apps ALTER COLUMN widget_enabled SET DEFAULT true;

-- rp_idとsigning_key_encryptedをNULLABLEに（既存データとの互換性維持）
-- 新規アプリはHumanAuth共通の値が入る
ALTER TABLE ha_apps ALTER COLUMN rp_id DROP NOT NULL;
ALTER TABLE ha_apps ALTER COLUMN signing_key_encrypted DROP NOT NULL;
