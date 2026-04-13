# Railway デプロイメントガイド

このプロジェクトは Railway にデプロイできます。

## 前提条件

- Railway アカウント（https://railway.app）
- GitHub リポジトリへのアクセス

## デプロイ手順

### 1. Railway にログイン

https://railway.app にアクセスしてログインします。

### 2. 新しいプロジェクトを作成

1. Dashboard で「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. このリポジトリ（thinking-diagnostic-test）を選択

### 3. 環境変数を設定

Railway の「Variables」セクションで以下の環境変数を設定します：

```
DATABASE_URL=postgresql://...  # PostgreSQL 接続文字列
JWT_SECRET=your-secret-key     # JWT シークレット（任意の文字列）
NODE_ENV=production
```

### 4. PostgreSQL データベースを追加

1. Railway Dashboard で「+ New」をクリック
2. 「Database」から「PostgreSQL」を選択
3. 自動的に `DATABASE_URL` が設定されます

### 5. デプロイ

設定完了後、自動的にデプロイが開始されます。

## 環境変数の詳細

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `DATABASE_URL` | PostgreSQL 接続文字列 | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT トークン署名用シークレット | `your-random-secret-key` |
| `NODE_ENV` | 実行環境 | `production` |

## トラブルシューティング

### ビルドエラー

```
error: Cannot find module '@shared/diagnosticData'
```

この場合、以下を実行してください：

```bash
npm install
npm run build
```

### データベース接続エラー

`DATABASE_URL` が正しく設定されているか確認してください。

### ポート設定

Railway は自動的にポートを割り当てます。コード内でポート番号をハードコードしないでください。

## デプロイ後

1. Railway Dashboard でアプリケーションの URL を確認
2. ブラウザでアクセスして診断機能が動作することを確認

## 本番環境での注意

- `JWT_SECRET` は十分にランダムな値を設定してください
- データベースのバックアップを定期的に取得してください
- ログを監視してエラーを検出してください

## サポート

問題が発生した場合は、Railway のドキュメント（https://docs.railway.app）を参照してください。
