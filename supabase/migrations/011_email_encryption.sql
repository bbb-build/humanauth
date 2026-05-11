-- ステップ3 (2026-05-11): ha_users.email を AES-GCM で暗号化保存に切替
--
-- このマイグレーションは「スキーマ変更を伴わない切替記録」です。
-- ha_users.email は TEXT のまま、内容のフォーマットだけが変わります:
--   旧: 平文のメールアドレス ("alice@example.com")
--   新: "v<N>:<base64>" 形式の暗号文 (lib/crypto.ts の encryptWithActiveKey)
--
-- 既存データの扱い (lazy migration):
--   src/lib/email-store.ts の getUserEmail は、prefix "v<N>:" を持たない値を
--   平文と判定し、アクティブ鍵で暗号化して書き戻します。次回 OIDC ログインや
--   /api/users/me 等で参照されたタイミングで自動的に暗号化されます。
--
-- 一括バックフィルが必要になった場合:
--   scripts/backfill-email-encryption.ts (未実装) を用意するか、
--   下記の関数を一時的に作って `SELECT ha_backfill_emails()` を1度実行する方針です。
--   現状コードベースには email を書き込む経路が無いため (World ID は email を返さない)、
--   平文レコードが大量に積み上がる前にこの暗号化境界を導入できています。
--
-- 鍵管理:
--   ENCRYPTION_KEYS, ENCRYPTION_ACTIVE_KEY_VERSION で複数世代を扱います。
--   詳細は docs/security/encryption.md を参照。

-- 監査用の軽量ビュー: 暗号化済み / 平文 / NULL の比率を見たい時に使う
CREATE OR REPLACE VIEW ha_email_encryption_status AS
SELECT
  CASE
    WHEN email IS NULL THEN 'null'
    WHEN email ~ '^v[0-9]+:' THEN 'encrypted'
    ELSE 'plaintext'
  END AS status,
  COUNT(*) AS user_count
FROM ha_users
GROUP BY 1;

COMMENT ON VIEW ha_email_encryption_status IS
  'ステップ3 (2026-05-11) の email 暗号化進捗を確認するためのビュー。lazy migration の進捗監視用。';
