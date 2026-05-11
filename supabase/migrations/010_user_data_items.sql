-- Vault 型データモデル: Phase A/B/C で増える「ユーザーが許諾すれば渡せるデータ」の汎用ストア
-- 設計判断 (2026-05-11):
--   - 固定カラム拡張は migration 地獄になる → 汎用 (namespace, key, value JSONB) で受ける
--   - 既存 ha_users (handle / display_name / avatar_url / email / verification_level) はそのまま残す
--     理由: OIDC profile / email scope は claim 名が決まっているので固定カラムで型安全に。
--           既存ユーザーのデータ移行コストも回避。暗号化はステップ3で別途扱う
--   - encrypted / schema_version / source / scope_name は最初から持たせる（後付けは地獄）
--
-- 命名規約 (namespace):
--   humad.*         — Humad 自身が管理する派生データ (humad.apps_used, humad.verified_actions)
--   profile.*       — ユーザー自己申告 (profile.interests, profile.locale) — Phase B
--   external.<p>.*  — 外部 OAuth ブローカー経由取得 (external.google.gmail) — Phase C
--   wallet.*        — ウォレット連携 — Phase C 予約
--   subscriptions.* — Vault に置いたサブスク一覧 — Phase C 予約
--
-- scope との対応:
--   namespace.key と OIDC scope `<namespace>.<key>:read` を 1:1 で対応させる
--   (例: humad.apps_used:read scope → humad namespace の apps_used key)
--   resolver 側で SCOPE_REGISTRY と突き合わせて claim 化する

CREATE TABLE IF NOT EXISTS ha_user_data_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ha_users(id) ON DELETE CASCADE,
  -- ドット区切りの第1要素まで (例: humad / profile / external.google / wallet)
  namespace TEXT NOT NULL,
  -- namespace 内の識別子 (例: apps_used / interests / gmail)
  key TEXT NOT NULL,
  -- 平文時は通常 JSON、暗号化時は { ciphertext, iv, tag } 形式
  value JSONB NOT NULL,
  -- ステップ3 で段階的に暗号化前提に切替。既定は false（互換のため）
  encrypted BOOLEAN NOT NULL DEFAULT false,
  -- claim フォーマット変更時の互換維持用。userinfo レスポンスにも反映予定
  schema_version INT NOT NULL DEFAULT 1,
  -- データの来歴: self=ユーザー自己入力 / system=Humad システム生成 / external_oauth=外部API取得 / data_import=一括取込
  source TEXT NOT NULL DEFAULT 'self' CHECK (source IN ('self', 'system', 'external_oauth', 'data_import')),
  -- どの OIDC scope で返却するか (SCOPE_REGISTRY の scope name と一致させる)。NULL は scope 未割当（内部用）
  scope_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, namespace, key)
);

-- 主要アクセスパス: 「あるユーザーのある namespace を一括取得」(consent / userinfo)
CREATE INDEX IF NOT EXISTS idx_ha_user_data_items_user_ns ON ha_user_data_items(user_id, namespace);
-- scope 逆引き (どの scope に紐づくアイテムを持っているか) — partial index でサイズ削減
CREATE INDEX IF NOT EXISTS idx_ha_user_data_items_scope ON ha_user_data_items(scope_name) WHERE scope_name IS NOT NULL;

-- updated_at 自動更新トリガ
CREATE OR REPLACE FUNCTION ha_user_data_items_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ha_user_data_items_updated_at ON ha_user_data_items;
CREATE TRIGGER trg_ha_user_data_items_updated_at
BEFORE UPDATE ON ha_user_data_items
FOR EACH ROW
EXECUTE FUNCTION ha_user_data_items_set_updated_at();
