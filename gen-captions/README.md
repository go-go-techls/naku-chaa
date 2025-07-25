# Naku-cha（ナクチャ）

障害者アートに対して AI が多様な視点から創造的なタイトルや評価を生成する Web アプリケーションです。

## 概要

Naku-cha は、障害者の方が作成したアート作品に対して AI が 3 つの異なる視点（芸術専門家、お笑い芸人、ジムインストラクター）でタイトル生成や評価を行う Next.js アプリケーションです。

## 主な機能

### 🎨 アート評価機能

- **作品画像アップロード**: ユーザーが作品画像をアップロードできます
- **多角的な AI 評価**: 3 つの異なるキャラクター設定で AI が評価を実行
  - **先生（障害者アート講評家）**: 真面目で丁寧な評価
  - **芸人（お笑い芸人）**: 関西弁でユーモアのある評価
  - **インストラクター（ジムインストラクター）**: 体育会系で熱血な評価
- **作品情報生成**: タイトル、印象、良いところ、アドバイスを自動生成
- **評価・コメント機能**: 生成された内容に対する評価とコメント機能

### 🔐 認証・ユーザー管理

- **JWT 認証**: セキュアなトークンベース認証システム
- **ユーザー登録・ログイン**: 安全なアカウント管理
- **アバター生成**: ユーザーごとのランダム SVG アバター自動生成
- **管理者機能**: 全ユーザーの作品を閲覧可能な管理者アカウント
- **Basic 認証**: 新規登録時の追加セキュリティ

### 👤 マイページ機能

- **プロフィール表示**: ユーザー情報とアバター
- **統計情報**: 投稿作品数と利用日数の表示
- **権限表示**: 管理者ユーザーの識別バッジ

### 🛡️ セキュリティ機能

- **プライベート作品**: ユーザーは自分の作品のみ閲覧可能
- **UUID 使用**: 推測困難なユーザー ID
- **ミドルウェア認証**: 全ページ・API 保護
- **HttpOnly Cookie**: XSS 攻撃対策

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Material-UI v6
- **データベース**: PostgreSQL (Prisma ORM)
- **認証**: JWT + HttpOnly Cookie, bcryptjs
- **AI**: OpenAI GPT-4o, LangChain v0.3.x
- **その他**: UUID, SVG Avatar 生成

## セットアップ

### 前提条件

1. Node.js (推奨バージョン: 18 以上)
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

# OpenAI API設定
OPENAI_API_KEY="your-openai-api-key"

# JWT認証設定
JWT_SECRET="your-jwt-secret-key"

# Basic認証設定（新規登録時）
BASIC_AUTH_USER="admin"
BASIC_AUTH_PASSWORD="your-basic-auth-password"
```

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

### 初期管理者設定

管理者アカウントを作成するには：

1. `/register`ページに直接アクセス（Basic 認証必要）
2. 管理者ユーザーを登録
3. データベースで該当ユーザーの`role`を`admin`に変更

```sql
UPDATE "User" SET "role" = 'admin' WHERE "email" = 'admin@example.com';
```

## プロジェクト構造

```
gen-captions/
├── app/
│   ├── api/
│   │   ├── auth/           # 認証関連API（login, register, me）
│   │   └── arts/           # 作品関連API（CRUD, count）
│   ├── contexts/           # React Context（認証状態管理）
│   ├── components/
│   │   ├── auth/           # 認証関連コンポーネント
│   │   └── common/         # 共通コンポーネント（Header等）
│   ├── login/              # ログインページ
│   ├── register/           # ユーザー登録ページ
│   ├── mypage/             # マイページ
│   └── arts/               # 作品関連ページ
├── lib/
│   ├── auth.ts             # JWT認証ユーティリティ
│   ├── avatar.ts           # SVGアバター生成
│   └── prisma.ts           # Prismaクライアント
├── prisma/
│   └── schema.prisma       # データベーススキーマ
├── middleware.ts           # Next.js認証ミドルウェア
└── scripts/                # データベース更新スクリプト
```

## 利用可能なスクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLint によるコード検査
- `npx prisma studio` - データベース管理画面
- `npx prisma db push` - スキーマをデータベースに適用
- `node scripts/update-avatars.js` - 既存ユーザーにアバター追加

## アーキテクチャ

### 認証フロー

1. **ログイン**: メール・パスワード → JWT 生成 → HttpOnly Cookie 設定
2. **アクセス制御**: Middleware → JWT 検証 → ページ/API 保護
3. **権限管理**: 一般ユーザー（自分の作品のみ）、管理者（全作品閲覧可）

### セキュリティ対策

- **JWT + HttpOnly Cookie**: XSS 攻撃対策
- **UUID**: 推測困難なユーザー ID
- **Basic 認証**: 新規登録の追加保護
- **ミドルウェア**: 全エンドポイント保護
- **bcrypt**: パスワードハッシュ化

## 更新履歴

### v2.0.0 (2025-07-26)

- 🔐 JWT 認証システム実装
- 👤 ユーザー管理・マイページ追加
- 🎨 ランダム SVG アバター生成
- 🛡️ セキュリティ強化（UUID、権限管理）
- ⚡ パフォーマンス最適化
