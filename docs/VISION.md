# HumanAuth — Vision & Roadmap

最終更新: 2026-05-09

このドキュメントは HumanAuth の中長期ビジョンと、それに対する近距離（v0.2）の意思決定を整理する。
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
| L3: 委任された代理 | 「このエージェントは誰の代理として動いているか」 | （未実装。後述） |

L1 と L2 はすでに DB 設計が並走している（2026-05-09 のマイグレーションで投入済み）。
L3 はまだ市場が立ち上がっていないので **設計の余白を残す段階**。

### 「認証回数」自体をネットワーク資産化する戦略

BBB の判断（2026-05-08 スレッド）として、**HumanAuth が World ID 認証を世にばらまく経路になること自体に価値がある**という方針が確定している。
これは Worldcoin Foundation 側に対する交渉カードであり、HumanAuth の MAU が拡大するほど World 側のネットワーク効果と相互強化される。

このため、収益最大化よりも **「World ID 経由の人間性証明をより多くのプロダクトに通す」** ことを KPI 上位に置く設計を優先する。
無料枠（Free 1,000 MAU）の存在意義はここにある。

---

## 3. v0.2 のスコープ（直近3〜6ヶ月）

### メインに置くもの（コア完成度）

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

### 視野には入れるが v0.2 のメインには入れないもの

- **x402（Coinbase 起源、AWS AgentCore で採用された支払いプロトコル）対応**
  Payment 層と Identity（principal）層は別レイヤーであり、x402 が解いていない「誰の代理として支払うか」に HumanAuth が座る余地はある。
  ただし市場が立ち上がるのは 12〜24 ヶ月後の判断。**設計メモのみ残し、実装は需要が顕在化してから**。
- **OAuth 拡張: DPoP `cnf` クレーム**
  これは agent 経済抜きでも価値がある（トークン盗難対策）。**v0.2 で「入れられるなら入れる」枠**。後で principal 委任を載せるときの基盤になる。

### 明示的に保留・撤回するもの

- **「3〜6ヶ月で window が閉じる」という煽り**
  AWS / Anthropic / OpenAI が自前で identity 層を構築する根拠は薄い。むしろ Privy / Civic / Worldcoin に委ねる方が自然。窓が閉じるとしたら競合 identity プロバイダ側であり、緊急性のロジックとしては弱い。**撤回する**。
- **`WWW-Authenticate: HumanAuth-DPoP` の技術的主張**
  x402 の現行ドラフトは HTTP 402 応答ボディの `accepts` 配列で支払い手段を返す形式。`WWW-Authenticate` ヘッダ拡張が公式に開かれているかは未検証。**実物の spec を読むまでドキュメントには書かない**。

---

## 4. L3（agent 委任）に関する設計メモ

将来 agent-as-a-service が立ち上がったときに HumanAuth が取れる位置:

- エージェントが API を叩くとき `Authorization: Bearer <agent_token>` だけでは不十分
- principal（誰の代理か）を identity 層が証明する必要がある
- HumanAuth は World ID で人間 principal をすでに識別しているため、`agent → human principal` の委任関係を発行できる立場にある
- 想定プリミティブ: `ha_agent_delegations`（principal_nullifier, agent_id, scopes, expires_at, signature）
- DPoP の `cnf` クレームに principal の nullifier を含めれば、x402 や OAuth リソースサーバ側が「人間の代理である」ことを検証できる

これは **実装には進まない**。市場の信号（agent-as-a-service の取引量、principal 検証の需要）が立ったら設計を起こす。

---

## 5. 判断基準（いつ L3 に進むか）

次のいずれかが満たされたとき、L3 着手を検討する:

1. AgentCore Payments / x402 を本番で使う顧客が「principal 証明が欲しい」と直接要望してきた
2. agent-as-a-service の月次取引高が（Coinbase / AWS の公開数字で）月 $10M を超えた
3. Privy / Civic などの競合が principal 委任機能を出してきた（追随判断）

それまでは **L1 + L2 の SaaS としての完成度** に集中する。

---

## 6. 次のレビュータイミング

- 2026-08（v0.2 リリース後）: ドッグフード結果を見て L3 設計メモを更新するか判断
- 2026-11（半年後）: x402 の spec が固まっているはず。`WWW-Authenticate` 拡張の実体を読んで再評価
