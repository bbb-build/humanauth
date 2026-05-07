-- ウィジェット埋め込み対応: ドメイン制限 + 有効フラグ
ALTER TABLE ha_apps ADD COLUMN IF NOT EXISTS allowed_domains TEXT[] DEFAULT '{}';
ALTER TABLE ha_apps ADD COLUMN IF NOT EXISTS widget_enabled BOOLEAN DEFAULT false;

COMMENT ON COLUMN ha_apps.allowed_domains IS 'ウィジェット使用を許可するドメイン一覧。空=全ドメイン許可';
COMMENT ON COLUMN ha_apps.widget_enabled IS 'ウィジェット埋め込みの有効/無効';
