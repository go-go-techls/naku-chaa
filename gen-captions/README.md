# Naku-cha（ナクチャ）

障害者アートに対してAIが多様な視点から創造的なタイトルや評価を生成するWebアプリケーションです。

## 概要

Naku-chaは、障害者の方が作成したアート作品に対してAIが3つの異なる視点（芸術専門家、お笑い芸人、ジムインストラクター）でタイトル生成や評価を行うNext.jsアプリケーションです。

## 主な機能

- **作品画像アップロード**: ユーザーが作品画像をアップロードできます
- **多角的なAI評価**: 3つの異なるキャラクター設定でAIが評価を実行
  - **先生（障害者アート講評家）**: 真面目で丁寧な評価
  - **芸人（お笑い芸人）**: 関西弁でユーモアのある評価  
  - **インストラクター（ジムインストラクター）**: 体育会系で熱血な評価
- **作品情報生成**: タイトル、印象、良いところ、アドバイスを自動生成
- **評価・コメント機能**: 生成された内容に対する評価とコメント機能
- **データベース保存**: PostgreSQLを使用した作品データの永続化

## 技術スタック

- **フロントエンド**: Next.js 13, React 18, TypeScript
- **スタイリング**: Tailwind CSS, Material-UI
- **データベース**: PostgreSQL (Prisma ORM)
- **AI**: OpenAI API, Ollama
- **その他**: LangChain

## セットアップ

### 前提条件

1. Node.js (推奨バージョン: 18以上)
2. PostgreSQL データベース
3. OpenAI API キー（または Ollama のローカルセットアップ）

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd gen-captions

# 依存関係をインストール
npm install

# データベースのマイグレーション実行
npx prisma generate
npx prisma db push
```

### 環境変数設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# PostgreSQL接続情報
POSTGRES_PRISMA_URL="your-postgres-connection-string"
POSTGRES_URL_NON_POOLING="your-postgres-direct-connection-string"

# OpenAI API設定（Ollama使用時は不要）
OPENAI_API_KEY="your-openai-api-key"
```

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

### Ollama使用時の追加セットアップ

Ollamaを使用する場合は以下の手順を実行してください：

1. [Ollama](https://ollama.ai/download) をダウンロードしてインストール
2. Ollamaサービスを起動
3. http://localhost:11434 でOllamaが動作していることを確認

## プロジェクト構造

```
gen-captions/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── arts/           # アート関連ページ
│   └── components/     # Reactコンポーネント
├── lib/                # ユーティリティ関数
├── prisma/             # データベーススキーマ
├── public/             # 静的ファイル
└── scripts/            # スクリプトファイル
```

## 利用可能なスクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintによるコード検査
