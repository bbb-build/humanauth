# HumanAuth — World ID Authentication Gateway

## Overview
World ID認証のマネージドゲートウェイ。RP署名・nullifier管理・MAUトラッキングをフルマネージド化し、開発者が2行で導入できるようにする。

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (verified-humans project, ha_ prefix)
- World ID SDK (@worldcoin/idkit v4)
- Vercel: humanauth.vercel.app

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── verify/           ← World ID検証プロキシ（コアAPI）
│   │   ├── rp-context/       ← 顧客用RP署名生成
│   │   ├── auth/login/       ← ダッシュボードWorld IDログイン
│   │   ├── auth/rp-context/  ← ダッシュボード用RP context
│   │   ├── apps/             ← アプリ管理CRUD + APIキー
│   │   └── dashboard/stats/  ← ダッシュボード統計
│   ├── dashboard/            ← ダッシュボードUI（World ID認証）
│   ├── docs/                 ← ドキュメント
│   └── page.tsx              ← ランディングページ
├── lib/
│   ├── supabase.ts           ← Supabaseクライアント
│   ├── jwt.ts                ← JWT認証（jose）
│   ├── crypto.ts             ← AES-256-GCM暗号化
│   ├── api-auth.ts           ← APIキー認証
│   └── constants.ts          ← プラン定義
sdk/                          ← @humanauth/sdk npmパッケージ
supabase/migrations/          ← DBスキーマ（ha_ prefix）
```

## World ID App
- App ID: app_83fc7e7ad1a6f7c8c4c9fb82d2c25f62
- RP ID: rp_1615a7a4b90b2c2b

## Revenue Model
- Free: 1,000 MAU / Pro: $49/月 / Business: $199/月
