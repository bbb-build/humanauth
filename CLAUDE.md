# Humad — World ID Authentication Gateway

## Overview
World ID認証のマネージドゲートウェイ。RP署名・nullifier管理・MAUトラッキングをフルマネージド化し、開発者が2行で導入できるようにする。**Login with Humad（OIDC）**を一般Web/SaaS向けIDレイヤーとして提供。

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (verified-humans project, ha_ prefix)
- World ID SDK (@worldcoin/idkit v4)
- Vercel: humanauth.vercel.app（仮置きドメイン）

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
sdk/                          ← humad-sdk npmパッケージ
supabase/migrations/          ← DBスキーマ（ha_ prefix — リネーム前の名残、Phase 5で整理予定）
```

## World ID App
- App ID: app_83fc7e7ad1a6f7c8c4c9fb82d2c25f62
- RP ID: rp_1615a7a4b90b2c2b

## Revenue Model
- IDレイヤー自体は単体収益化しない（Facebook Login型）。HUMADブランドとして、認証済みユーザーのデータ価値を別ライン（HUMAD Ads等）で収益化する戦略。

## Vision / Roadmap
中長期ビジョンと v0.2 の意思決定は `docs/VISION.md` を参照。
- v0.2 は World ID ラッパとしての完成度に集中（OAuth フロー安定化、ダッシュボード、ドッグフード）
- x402 / agent principal 層は視野には入れるが実装は需要が立ってから

## Branding（2026-05-11 確定）
- プロダクト名: **Humad**（旧 HumanAuth）
- ボタン文言: **Login with Humad**
- npm パッケージ: **humad-sdk**（旧 humanauth-sdk は deprecate）
- 据置: 環境変数 `HUMANAUTH_*`、DBテーブル `ha_*`、World ID action名、Vercelドメイン（仮置き）
