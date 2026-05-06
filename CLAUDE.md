# HumanAuth — World ID Authentication Gateway

## Overview
World ID認証のマネージドゲートウェイ。RP署名・nullifier管理・MAUトラッキングをフルマネージド化し、開発者が2行で導入できるようにする。

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (既存16Typeプロジェクト相乗り、ha_ prefix)
- World ID SDK (@worldcoin/idkit v4)
- Vercel デプロイ

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── verify/       ← World ID検証プロキシ（コアAPI）
│   │   ├── rp-context/   ← RP署名生成（4.0必須）
│   │   ├── apps/         ← アプリ管理CRUD
│   │   └── dashboard/    ← ダッシュボード用API
│   ├── dashboard/        ← ダッシュボードUI
│   ├── docs/             ← ドキュメント
│   └── page.tsx          ← ランディングページ
├── lib/
│   ├── supabase.ts       ← Supabaseクライアント
│   ├── jwt.ts            ← JWT認証
│   ├── crypto.ts         ← AES-256-GCM暗号化（署名キー保護）
│   ├── api-auth.ts       ← APIキー認証ミドルウェア
│   └── constants.ts      ← プラン定義
sdk/
└── humanauth-react.tsx   ← ドロップインReactコンポーネント（将来npm化）
supabase/
└── migrations/001_initial.sql ← DBスキーマ（ha_ prefix）
```

## Database Tables (ha_ prefix)
- ha_apps: アプリ登録
- ha_api_keys: APIキー（ハッシュ保存）
- ha_nullifiers: nullifier重複検出
- ha_verification_logs: 認証ログ
- ha_mau_tracking: MAUカウント

## Revenue Model
- Free: 1,000 MAU
- Pro: $49/月 (10,000 MAU)
- Business: $199/月 (100,000 MAU)
