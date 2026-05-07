-- 修正: nullifier upsert の onConflict("app_id,nullifier_hash") に合わせる
-- 元の制約は UNIQUE(app_id, nullifier_hash, action) で3カラムだったが、
-- nullifier_hash は World ID の仕様上 action ごとに異なるハッシュになるため、
-- 同じ nullifier_hash が異なる action で出現することはない。
-- 2カラム制約が正しい。

ALTER TABLE ha_nullifiers DROP CONSTRAINT IF EXISTS ha_nullifiers_app_id_nullifier_hash_action_key;
ALTER TABLE ha_nullifiers ADD CONSTRAINT ha_nullifiers_app_id_nullifier_hash_key UNIQUE (app_id, nullifier_hash);
