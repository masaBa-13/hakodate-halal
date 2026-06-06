# 函館ハラルマップ

函館・道南エリアのムスリムフレンドリー店舗マップアプリ。

## セットアップ

### 1. Wrangler インストール・ログイン

```bash
npm install -g wrangler
wrangler login
```

### 2. Cloudflare リソース作成

```bash
# D1 データベース作成
wrangler d1 create halal-map-db
# → 出力された database_id を worker/wrangler.toml の database_id に記入

# R2 バケット作成
wrangler r2 bucket create halal-map-photos
```

### 3. DBスキーマ適用

```bash
cd worker
npm install
npm run db:migrate          # ローカル
npm run db:migrate:remote   # 本番
```

### 4. Worker 起動（ローカル）

```bash
cd worker
npm run dev
# → http://localhost:8787
```

### 5. フロントエンド起動（ローカル）

```bash
cd frontend
npm install
cp .env.example .env
# .env に VITE_GOOGLE_MAPS_API_KEY を記入
npm run dev
# → http://localhost:5173
```

## 本番デプロイ

```bash
# Worker
cd worker
wrangler deploy

# フロントエンド（Cloudflare Pages）
cd frontend
npm run build
wrangler pages deploy dist
```

## 管理者JWTの発行

管理者JWTはWorkerのJWT_SECRETで `role: "admin"` のトークンを署名して発行します。
開発用は以下のnodeスクリプトで生成できます：

```js
// generate-admin-token.js
import { SignJWT } from 'jose'
const key = new TextEncoder().encode('change-me-in-production')
const token = await new SignJWT({ role: 'admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('365d')
  .sign(key)
console.log(token)
```

## ページ構成

| URL | 説明 |
|-----|------|
| `/` | 地図メインページ |
| `/list` | リストビュー |
| `/shops/:id` | 店舗詳細 |
| `/register` | 事業者登録 |
| `/admin` | 管理者ページ |
