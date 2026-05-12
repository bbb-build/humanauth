# 暗号化レイヤと鍵ローテ運用

Humad は機微情報を AES-GCM で対称暗号化して保存します。本書はその実装と鍵ローテ手順をまとめたものです。

## スコープ

| データ | 保存場所 | 暗号化 | 導入時期 |
|---|---|---|---|
| `ha_users.email` | `ha_users` テーブル | ◯ (ステップ3) | 2026-05-11 |
| `ha_users.handle` / `display_name` / `avatar_url` | `ha_users` テーブル | ✕ (機微度低) | — |
| Vault データ (`ha_user_data_items`) | `ha_user_data_items` テーブル | △ (`encrypted` フラグで個別) | Phase B |
| ID トークン / Access トークン | DB に保存しない / 一時的 | 該当なし | — |

## 暗号文フォーマット

`v<N>:<base64>` 形式の文字列です。

- `v<N>` … 鍵世代 (`v1`, `v2`, ...)
- `base64` … `IV(12byte) || ciphertext` を base64 エンコードしたもの

例: `v1:Bk3...AA==`

prefix を持たない値は「未暗号化のレガシーデータ」とみなされ、lazy migration の対象になります (後述)。

## 鍵管理

### 環境変数

| 変数 | 必須 | 意味 |
|---|---|---|
| `ENCRYPTION_KEYS` | どちらか | 全世代を列挙: `v1:abc...,v2:def...` (カンマ区切り) もしくは JSON `{"v1":"abc...","v2":"def..."}` |
| `ENCRYPTION_KEY` | どちらか | 後方互換用。単一鍵を v1 として扱う。`ENCRYPTION_KEYS` 未設定時のみ参照 |
| `ENCRYPTION_ACTIVE_KEY_VERSION` | 任意 | 書き込みに使う世代名 (例: `v2`)。未指定時は最大世代を自動選択 |

### 鍵生成

256bit (32byte) のランダム鍵を hex で出力:

```bash
openssl rand -hex 32
```

### Vercel での設定例

Production 環境変数:

```
ENCRYPTION_KEYS=v1:abc123...def
ENCRYPTION_ACTIVE_KEY_VERSION=v1
```

複数世代を持つ場合:

```
ENCRYPTION_KEYS=v1:abc123...def,v2:fed321...cba
ENCRYPTION_ACTIVE_KEY_VERSION=v2
```

## 鍵ローテ手順

新しい鍵 `v2` を導入し、最終的に `v1` を退役させる流れです。

### 1. v2 を併存させる (読みは両対応、書きは v1 のまま)

```
ENCRYPTION_KEYS=v1:<v1鍵>,v2:<v2鍵>
ENCRYPTION_ACTIVE_KEY_VERSION=v1   ← 変更しない
```

デプロイ後、v2 で暗号化されたデータも復号できる状態になります。

### 2. アクティブ世代を v2 に切り替え (新規書き込みは v2、既存は v1 のまま)

```
ENCRYPTION_KEYS=v1:<v1鍵>,v2:<v2鍵>
ENCRYPTION_ACTIVE_KEY_VERSION=v2
```

この時点から、`encryptWithActiveKey()` が呼ばれるたびに v2 で暗号化されます。
既存の v1 暗号文は復号時に v1 で読まれます (透過的)。

### 3. 全レコードを v2 に書き換える (オプション)

明示的に全件マイグレーションしたい場合のみ。スクリプト例:

```sql
-- DRY-RUN (件数確認)
SELECT COUNT(*) FROM ha_users WHERE email LIKE 'v1:%';
```

アプリ側で `getUserEmail()` を呼ぶ経路を辿るレコードは、`getUserEmail` 内の lazy 書き戻し (現状は平文 → アクティブ鍵への書き戻しのみ実装) が将来 v1 → アクティブ世代への書き換えにも対応する想定です。必要になった段階で `src/lib/email-store.ts` を拡張します。

### 4. v1 を退役

全レコードが v2 になったことを確認したのち:

```
ENCRYPTION_KEYS=v2:<v2鍵>
ENCRYPTION_ACTIVE_KEY_VERSION=v2
```

v1 暗号文がまだ残っている状態で v1 鍵を消すと、それらのレコードは復号不能になります。退役は必ず移行完了確認の後に行ってください。

## Lazy Migration の挙動

`src/lib/email-store.ts` の `getUserEmail()` は以下の順で動きます:

1. `ha_users` から `email` (暗号文 or 平文) と `email_verified` を取得
2. `email` が NULL → そのまま返す
3. `email` が `v<N>:` で始まる → 該当鍵で復号して返す
4. `email` が prefix を持たない → 平文とみなす:
   - アクティブ鍵で暗号化して `ha_users.email` を更新 (失敗しても呼び出し側には平文を返す)

この挙動により、ステップ3 のデプロイ直後はバックフィル不要で運用を開始できます。ただし「書き込み経路」(現状未実装) を追加した場合は必ず `setUserEmail()` 経由で行い、暗号化を強制してください。

## 監査ビュー

進捗監視用に `ha_email_encryption_status` ビューを用意しています:

```sql
SELECT * FROM ha_email_encryption_status;
```

```
 status     | user_count
------------+------------
 encrypted  |       1234
 plaintext  |          0
 null       |        567
```

## 失敗モード

| 状況 | 挙動 |
|---|---|
| 復号失敗 (鍵が無い世代の暗号文) | `email` を `null` として返す。HTTP 500 にはしない。userinfo / id_token では email claim が単に欠落 |
| `ENCRYPTION_KEYS` / `ENCRYPTION_KEY` 未設定 | 起動時 (初回呼び出し時) に例外。Vercel ログで `ENCRYPTION_KEYS or ENCRYPTION_KEY is not set` を確認 |
| `ENCRYPTION_ACTIVE_KEY_VERSION` が `ENCRYPTION_KEYS` に存在しない | 起動時例外。デプロイ前に env 構成を点検 |

## 関連実装

- `src/lib/crypto.ts` — 鍵世代対応 AES-GCM レイヤ
- `src/lib/email-store.ts` — `ha_users.email` の暗号化境界
- `supabase/migrations/011_email_encryption.sql` — 切替記録 + 監査ビュー
