# Mosport API Server

後端 API 服務，處理前端請求與資料庫操作。

## 技術棧

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon)
- **ORM**: Native `pg` driver

## 設定步驟

### 1. 安裝依賴

```bash
cd api
npm install
```

### 2. 環境變數

在 `api/` 目錄建立 `.env`：

```bash
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173

# OAuth (待實作)
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_SECRET=
ZALO_APP_SECRET=
```

### 3. 執行開發服務器

```bash
npm run dev
```

API 會在 `http://localhost:3001` 啟動。

## API Endpoints

### Events

- `GET /api/events` - 取得賽事列表
  - Query: `city`, `sport`, `from`, `to`
- `GET /api/events/:id` - 取得賽事詳情

### Venues

- `GET /api/venues` - 取得場館列表
  - Query: `city`
- `GET /api/venues/:id` - 取得場館詳情
- `POST /api/venues` - 建立場館（需認證）

### Auth

- `POST /api/auth/callback` - OAuth 回調處理
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 取得當前用戶

### Health

- `GET /health` - 健康檢查

## 測試 API

```bash
# 健康檢查
curl http://localhost:3001/health

# 取得賽事（河內）
curl "http://localhost:3001/api/events?city=Ha%20Noi"

# 取得場館
curl http://localhost:3001/api/venues
```

## TODO

- [ ] 實作真實 OAuth token 交換邏輯
- [ ] 加入 JWT 認證中介層
- [ ] 實作 DTSS 驗證邏輯
- [ ] 加入 Rate Limiting
- [ ] 實作 Trust Score 計算
- [ ] 加入 API 文件 (Swagger)

## 架構

```
api/
├── src/
│   ├── index.js        # 主程式
│   ├── db.js           # 資料庫連接
│   └── routes/         # API 路由
│       ├── events.js
│       ├── venues.js
│       └── auth.js
├── package.json
└── .env
```
