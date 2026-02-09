# 要件定義：おおさまのみみはろばのみみ (King's Ears Fortress)

## 1. サービスコンセプト

ユーザーが抱える「禁忌の秘密」をデジタル世界の穴に埋める。
一度埋められた秘密は、DBのみぞ知り、ユーザー自身も二度と触れることはできない。

## 2. 機能要件

- **POST /secrets**: 秘密の埋設。
  - Zodによる「禁忌ワード（王様・ロバ等）」の正規化検閲。
  - 同一内容のハッシュチェックによる連投BAN。
- **GET /secrets**: 状態確認。
  - 内容（Content）の露出は不可。総数と最終更新時刻のみ。
- **DELETE /secrets/{id}**: 秘密の完全抹消。

## 3. 非機能要件（過剰防衛項目）

- **Mutation Score 100%**: テストの脆弱性をStrykerで完全排除。
- **TypeSpec Driven Design**: 設計から実装まで完全な型安全。
- **RFC 7807 Compliance**: 全てのエラーを機械判読可能なリッチな形式で返却。
- **P95 Latency < 50ms**: エッジコンピューティング（Cloudflare Workers）による超高速処理。

## 4. 異常系定義

- `403 Forbidden`: 禁忌ワード検知、または同一内容連投。
- `422 Unprocessable Entity`: 文字数・型・正規化エラー。
- `507 Insufficient Storage`: 穴（DB）の物理的満杯。
