# Architecture Design: おおさまのみみはろばのみみ

本ドキュメントでは、「王様の耳はロバの耳」という寓話を現代の Web 技術で解釈し、堅牢性を高めた「秘密隠蔽システム」の構造を定義する。

## 1. 設計思想 (Philosophy)

本システムは、機能の最小化（Middle-less）と、品質の最大化（Over-engineered）を両立させる。

- **Immutability (不変性):** 秘密は一度叫ばれたら修正できない。
- **Ephemeral Access (刹那のアクセス):** 穴に埋めた秘密は、二度と人間の目に触れない。
- **Absolute Testability (絶対的テスト可能性):** 全てのロジックは、コード改ざんテスト（Mutation Testing）によって正当性を証明される。

## 2. ディレクトリ構成 (System Structure)

```text
.
├── tsp/                    # TypeSpec による API 設計
├── docs/                   # 要件定義・アーキテクチャ設計
├── src/
│   ├── domain/             # 禁忌のバリデーション・ULID生成
│   ├── application/        # ユースケース：Shout, Dig, Erase
│   ├── infrastructure/     # Cloudflare Workers, Turso (DB), Hono の接点
│   └── index.ts            # エントリーポイント
├── tests/
│   ├── unit/               # Vitest による高速な論理検証
│   ├── mutation/           # Stryker によるテストコード自体の品質テスト
│   ├── e2e/                # Playwright による再現性テスト
│   └── k6/                 # 負荷テスト：507エラーの挙動確認
└── .github/workflows/      # デプロイ・パイプライン


## 3. レイヤー設計 (Layered Architecture)

### Domain Layer
外部ライブラリへの依存を排除。Zod を用いた「禁忌ワード検閲」と、ULID による「時系列を内包した非推測ID」の生成を行う。

### Application Layer
API のエンドポイントとドメインロジックを仲介する。
特に GET 要求に対し、**「秘密の内容(Content)を返さず、数(Count)のみを返す」**という特殊なインターフェースを実装する。

### Infrastructure Layer
- **Runtime:** Cloudflare Workers (Edge Computing) による低レイテンシの実現。
- **Database:** Turso (libSQL) による分散 DB。秘密を地理的に分散された「穴」に保存する。

## 4. セキュリティ・信頼性設計 (Security & Reliability)

### API エラー・レスポンス (RFC 7807 準拠)
全てのエラーは `application/problem+json` 形式で返却され、エラー発生源のトレース ID を含む。

### ミューテーション・スコア 100%
Stryker によるミューテーションテストを実施。
例：「140文字制限」のコードをわざと「141文字」に書き換えた場合、テストが即座に失敗し、デプロイが阻止されることを保証する。

### 冪等性の担保
同一内容の秘密を短時間に複数回叫ぶ行為は、ハッシュ値ベースの検証により `403 Forbidden` として遮断する。

### インフラ境界エラーの考慮
本システムは Cloudflare Workers を採用しているため、アプリケーション層での 502 回避は困難であるが、Zombie Promise（未解決の非同期処理）を徹底排除し、ランタイムのクリーンな終了を保証することで、インフラ起因の 502 発生率を極限まで低減させている。
```
