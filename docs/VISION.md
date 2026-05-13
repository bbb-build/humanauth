# HumanAuth — Vision & Roadmap

最終更新: 2026-05-14

このドキュメントは HumanAuth の中長期ビジョンと、それに対する近距離（v0.2 / v0.3）の意思決定を整理する。
README / CLAUDE.md は「現状の仕様」を、本ドキュメントは「これからの方向性」を担う。

---

## 1. 現在の立ち位置（v0.1）

**プロダクトの軸: World ID をラップする managed SaaS（Stripe-like）**

差別化:
- Managed RP signing（AES-256-GCM、KMS不要）
- Nullifier dedup（DB設計を顧客が考えなくていい）
- MAU tracking + ダッシュボード
- IDKit v4 自動移行
- 2行でドロップインできる React コンポーネント

ターゲット: **World ID を入れたいが、自分で RP 鍵を握りたくない・分析を作りたくない MiniApp 開発者**

---

## 2. 中長期ビジョン

### Identity 層としての HumanAuth

現状の World ID ラッパとしての SaaS は、ビジョンの **第一段** にすぎない。
HumanAuth が中期で取りに行く位置は **「World ID を起点に、人間性のある principal を継続的に証明し続けるレイヤー」**。

具体的には次の3レイヤーを段階的に重ねていく:

| レイヤー | 役割 | 対応するプリミティブ |
|---|---|---|
| L1: 単発の人間証明 | 「いまアクセスしてる人は人間か」 | ha_apps（reCAPTCHA型） |
| L2: 継続セッション | 「ログイン中のこの人は前と同じ人間か」 | ha_oauth_*（OAuth 2.1 / OIDC） |
| L3: 委任された代理 | 「このエージェントは誰の代理として動いているか」 | ha_agent_delegations（v0.3） |

L1 と L2 はすでに DB 設計が並走している（2026-05-09 のマイグレーションで投入済み）。
L3 は L2 の上に乗る委任層であり、OIDC の優先度を下げるものではない。まず L2 で human principal の継続セッションを固め、その principal を agent に委任する。

2026-05-14 の HATS 実機踏破により、agent に実作業を委任する導線が机上の話ではなくなった。これは市場信号として扱い、L3 を **v0.3 スコープへ格上げ**する。
鍵保管は引き続き custodial とし、暗号化は `lib/crypto.ts` の `encryptWithActiveKey` に統一する。参照実装は `humanauth.vercel.app/demo/agent-checkout` とし、Phase 4 で追加する。

### 「認証回数」自体をネットワーク資産化する戦略

BBB の判断（2026-05-08 スレッド）として、**HumanAuth が World ID 認証を世にばらまく経路になること自体に価値がある**という方針が確定している。
これは Worldcoin Foundation 側に対する交渉カードであり、HumanAuth の MAU が拡大するほど World 側のネットワーク効果と相互強化される。

このため、収益最大化よりも **「World ID 経由の人間性証明をより多くのプロダクトに通す」** ことを KPI 上位に置く設計を優先する。
無料枠（Free 1,000 MAU）の存在意義はここにある。

---

## 3. v0.2 / v0.3 のスコープ（直近3〜6ヶ月）

### v0.2 でメインに置くもの（コア完成度）

- **マルチアプリ OAuth フローの安定化**
  ha_oauth_* スキーマを使った Login with Humanary を、本物の顧客アプリで通す（自社の 16Type / MAScope を最初の顧客にする）
- **ダッシュボード強化**
  MAU、認証成功率、nullifier 重複率、課金状況の可視化
- **課金フロー**
  Free → Pro → Business のアップグレード経路を実装（Stripe想定）
- **SDK 安定化**
  humanauth-sdk v0.2 を semver で安定化、breaking change のフラグ整理
- **ドッグフード完了**
  16Type と MAScope を HumanAuth 経由の認証に切り替える（既存 World ID app_id はそのまま、検証だけ HumanAuth を通す）

### v0.3 に格上げするもの（L3 agent 委任）

- **L3: agent 委任層**
  HATS 実機踏破（2026-05-14）を市場信号として、`agent → human principal` の委任関係を v0.3 で扱う。
- **custodial key storage**
  顧客に鍵管理を持たせず、HumanAuth 側で保管する。暗号化は `lib/crypto.ts` の `encryptWithActiveKey` に統一し、L1 / L2 と同じ運用前提に置く。
- **参照実装**
  `humanauth.vercel.app/demo/agent-checkout` を Phase 4 で追加する。実装詳細は別文書に分離し、このドキュメントでは判断とロードマップだけを残す。

### 視野には入れるが v0.2 のメインには入れないもの

- **x402（Coinbase 起源、AWS AgentCore で採用された支払いプロトコル）対応**
  Payment 層と Identity（principal）層は別レイヤーであり、x402 が解いていない「誰の代理として支払うか」に HumanAuth が座る余地はある。
  ただし市場が立ち上がるのは 12〜24 ヶ月後の判断。**設計メモのみ残し、実装は需要が顕在化してから**。
- **OAuth 拡張: DPoP `cnf` クレーム**
  これは agent 経済抜きでも価値がある（トークン盗難対策）。**v0.2 で「入れられるなら入れる」枠**。後で principal 委任を載せるときの基盤になる。

### Phase 1〜4 ロードマップ（要約）

1. **Phase 1: L2 / OIDC の安定化**
   `ha_oauth_*` を使った Login with Humanary を本物の顧客アプリで通し、human principal の継続セッションを固める。
2. **Phase 2: agent 委任モデルの最小化**
   `ha_agent_delegations` の最小スキーマ、scope、期限、失効、監査ログの境界を決める。
3. **Phase 3: custodial signing / encryption の統一**
   委任鍵・署名素材の保管を custodial に寄せ、`encryptWithActiveKey` を共通経路にする。
4. **Phase 4: agent checkout reference**
   `humanauth.vercel.app/demo/agent-checkout` を参照実装として追加し、L2 principal から L3 delegation までの体験を見せる。

### 明示的に保留・撤回するもの

- **「3〜6ヶ月で window が閉じる」という煽り**
  AWS / Anthropic / OpenAI が自前で identity 層を構築する根拠は薄い。むしろ Privy / Civic / Worldcoin に委ねる方が自然。窓が閉じるとしたら競合 identity プロバイダ側であり、緊急性のロジックとしては弱い。**撤回する**。
- **`WWW-Authenticate: HumanAuth-DPoP` の技術的主張**
  x402 の現行ドラフトは HTTP 402 応答ボディの `accepts` 配列で支払い手段を返す形式。`WWW-Authenticate` ヘッダ拡張が公式に開かれているかは未検証。**実物の spec を読むまでドキュメントには書かない**。

---

## 4. L3（agent 委任）に関する設計メモ

agent-as-a-service が立ち上がる過程で HumanAuth が取れる位置:

- エージェントが API を叩くとき `Authorization: Bearer <agent_token>` だけでは不十分
- principal（誰の代理か）を identity 層が証明する必要がある
- HumanAuth は World ID で人間 principal をすでに識別しているため、`agent → human principal` の委任関係を発行できる立場にある
- 想定プリミティブ: `ha_agent_delegations`（principal_nullifier, agent_id, scopes, expires_at, signature）
- DPoP の `cnf` クレームに principal の nullifier を含めれば、x402 や OAuth リソースサーバ側が「人間の代理である」ことを検証できる

これは L2 の代替ではなく、L2 principal の上に乗る委任表現である。v0.3 では最小の agent checkout 参照実装までを目標にし、汎用 protocol 化や x402 連携の本実装は需要が顕在化してから判断する。

---

## 5. 判断基準（L3 をどこまで進めるか）

2026-05-14 の HATS 実機踏破により、L3 着手の最低条件は満たされたと判断する。
ただし v0.3 で進める範囲は参照実装と最小プリミティブに限定し、次のいずれかが満たされたときに本格展開を検討する:

1. AgentCore Payments / x402 を本番で使う顧客が「principal 証明が欲しい」と直接要望してきた
2. agent-as-a-service の月次取引高が（Coinbase / AWS の公開数字で）月 $10M を超えた
3. Privy / Civic などの競合が principal 委任機能を出してきた（追随判断）

それまでは **L1 + L2 の SaaS としての完成度** を落とさず、L3 は L2 の上に乗る最小導線として進める。

---

## 6. 次のレビュータイミング

- 2026-08（v0.2 リリース後）: ドッグフード結果を見て L3 の Phase 2 / 3 を更新するか判断
- 2026-11（半年後）: x402 の spec が固まっているはず。`WWW-Authenticate` 拡張の実体を読んで再評価
