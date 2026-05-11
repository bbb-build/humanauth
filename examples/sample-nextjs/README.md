# Humad Sample — Login with Humad

`humad-sdk@0.2.x` を使った最小サンプル (Next.js 15 / App Router)。

`signIn() → handleCallback() → getUser() → signOut()` の OAuth/OIDC フローを
そのまま実装してあります。E2E 動作検証用。

## セットアップ

```bash
# 1. このディレクトリで依存関係をインストール
cd examples/sample-nextjs
npm install

# 2. Humad ダッシュボードで OAuth Client を作成
#    https://humanauth.vercel.app/dashboard/oauth
#    redirect_uris に http://localhost:3000/oauth/callback を追加

# 3. .env.local を作成
cp .env.example .env.local
# 取得した client_id を NEXT_PUBLIC_HUMANAUTH_CLIENT_ID に貼り付ける
# (環境変数名は v0.2.x 互換のため HUMANAUTH_* のまま。v1.0 で HUMAD_* に整理予定)

# 4. 起動
npm run dev
```

ブラウザで http://localhost:3000 を開き、**Login with Humad** を押下。
World ID 認証 → consent → callback → ホーム画面に戻り、UserInfo + TokenSet が表示されれば成功。

## ファイル構成

```
app/
  layout.tsx               ルートレイアウト
  page.tsx                 ホーム（signIn / getUser / signOut）
  oauth/callback/page.tsx  callback（handleCallback でcode→token交換）
.env.example
package.json
tsconfig.json
next.config.ts
```

## 何が起きているか

1. `signIn()` が PKCE (verifier/challenge) と state を sessionStorage に保存し、
   `https://humanauth.vercel.app/api/oauth/authorize?...` にリダイレクト
2. ユーザーが `/oauth/signin` で World ID 認証 → `/oauth/consent` で同意
3. `?code=&state=` 付きで `/oauth/callback` に戻ってくる
4. `handleCallback()` が verifier を取り出して `/api/oauth/token` で
   authorization_code を access_token + refresh_token + id_token に交換
5. `getUser()` が `/api/oauth/userinfo` を Bearer 付きで叩いて UserInfo 取得
6. `signOut()` が `/api/oauth/revoke` (RFC 7009) でトークンを失効

## 注意

- このサンプルは PKCE のみで動く Public Client パターン。
  client_secret は使わない (ブラウザに置けないため)
- 本番のサーバーサイド統合では `exchangeCodeForTokens()` を Route Handler 内で
  呼び、access_token を HttpOnly Cookie に詰めるのが推奨
- このサンプルでは demo 目的で sessionStorage に tokens を保持しているが、
  本番ではこの実装は避けること
