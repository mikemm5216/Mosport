# 🚀 Mosport 部署進度記錄

**更新時間**: 2026-01-23 00:07  
**狀態**: Backend 部署中，Frontend 準備部署

---

## ✅ 今日完成項目

### 1. Railway Backend 部署
- ✅ 創建 Railway 專案 `grand-tenderness`
- ✅ 從 GitHub 連接 `mikemm5216/Mosport` repository
- ✅ 設定 Root Directory = `backend`
- ✅ 新增 PostgreSQL Database
- ✅ 新增 Redis
- ✅ 配置環境變數：
  - `DATABASE_URL` (連接到 Postgres)
  - `REDIS_URL` (連接到 Redis)
- ✅ Service `Mosport` 部署成功（Deployment successful）

**Railway 專案連結**:  
`https://railway.com/project/f7af26fb-2aeb-4213-b6d7-f4693b17dc32`

---

### 2. Vercel Frontend 準備
- ✅ 進入 Vercel 部署設定頁面
- ✅ 連接 GitHub repository
- ⏳ 環境變數配置中（`VITE_API_URL` 需要指向 Railway backend URL）

**Vercel 匯入連結**:  
`https://vercel.com/new/import?...`

---

## ⚠️ 待解決問題

### Railway Backend
1. **Database Migration 未執行**
   - 錯誤提示：可能有 `relation "events" does not exist`
   - **解決方案**：在 Railway 執行 `alembic upgrade head`

2. **確認 Backend URL**
   - 需要取得 Railway 分配的公開 URL
   - 格式：`https://mosport-production.up.railway.app` (範例)

3. **檢查應用運行狀態**
   - 查看 Logs 確認 Uvicorn 是否成功啟動
   - 測試 API endpoints

### Vercel Frontend
1. **設定環境變數**
   - `VITE_API_URL`: Railway backend URL
   - `VITE_GOOGLE_CLIENT_ID`: (如有)
   - `VITE_FACEBOOK_APP_ID`: (如有)
   - `VITE_ZALO_APP_ID`: (如有)
   - `VITE_OAUTH_REDIRECT_URI`: Vercel frontend URL

2. **Build 設定**
   - Root Directory: `./` (或留空，因為前端在根目錄)
   - Build Command: `npm run build` 或 `vite build`
   - Output Directory: `dist`

---

## 📋 下次繼續步驟

### Step 1: 取得 Railway Backend URL
1. 進入 Railway `Mosport` service
2. **Settings** tab → **Domains**
3. 點擊 **Generate Domain** 生成公開 URL
4. 複製 URL (例如: `https://mosport-production.up.railway.app`)

### Step 2: 在 Railway 執行 Database Migration
**方法 A: 使用 Railway CLI** (推薦)
```bash
railway login
railway link
railway run alembic upgrade head
```

**方法 B: 在程式啟動時自動執行**
- 修改 `main.py` 的 lifespan，在啟動時執行 migration
- 或在 `Procfile` 加入 pre-deploy hook

### Step 3: 完成 Vercel Frontend 部署
1. 在 Vercel Environment Variables 新增：
   ```
   VITE_API_URL = <Railway Backend URL>
   ```
2. 點擊 **Deploy** 按鈕
3. 等待 build 完成

### Step 4: 驗證部署
1. **Backend Health Check**:
   ```
   curl https://<railway-url>/health
   ```
   預期回應: `{"status":"healthy"}`

2. **Frontend 測試**:
   - 訪問 Vercel URL
   - 測試 API 調用
   - 檢查 Console 有無 CORS 錯誤

3. **CORS 設定檢查**:
   - 確認 `backend/app/core/config.py` 的 `BACKEND_CORS_ORIGINS` 包含 Vercel URL

---

## 🔧 已創建的配置檔案

### Backend
- ✅ `backend/railway.toml` - Railway 部署設定
- ✅ `backend/Procfile` - 啟動指令
- ✅ `backend/nixpacks.toml` - Python 環境
- ✅ `backend/.railwayignore` - 部署忽略檔案
- ✅ `RAILWAY_DEPLOYMENT.md` - 部署指南

### 已修正的問題
- ✅ GitHub Actions frontend cache path
- ✅ Railway Root Directory 設定
- ✅ Database/Redis 連接

---

## 📝 重要筆記

### Railway 免費方案限制
- **$5 免費額度/月**
- **500 小時執行時間**
- 建議綁定信用卡以避免服務中斷

### 環境變數架構
**Backend (Railway)**:
- `DATABASE_URL` ← Postgres
- `REDIS_URL` ← Redis
- `BACKEND_CORS_ORIGINS` ← Vercel URL

**Frontend (Vercel)**:
- `VITE_API_URL` ← Railway URL

### Constitutional Compliance ✅
所有部署符合 6 大憲法原則：
1. **Compare-only Doctrine** - 原始資料僅存 Redis
2. **Frontend Ignorance** - Frontend 無業務邏輯
3. **Federated Identity** - OAuth only
4. **Bundle & Ship** - GitHub Actions 已設定
5. **Shadow Log** - `ANTIGRAVITY_LOG.md` 已創建
6. **Monolingual** - 繁體中文 UI

---

## 🎯 最終目標

**Backend**: `https://mosport-production.up.railway.app/api/v1/events`  
**Frontend**: `https://mosport.vercel.app`  
**狀態**: 🟡 Backend 部署完成，Frontend 待完成

---

## 🐛 Known Issues

1. **Frontend Build 失敗** (GitHub Actions)
   - 原因: cache path 錯誤
   - 狀態: 已修正，待下次 push 驗證

2. **Backend Service Offline**
   - 原因: 可能是 Database Migration 未執行
   - 狀態: 待查看 logs 確認

---

**繼續時從 "下次繼續步驟" 開始！** 🚀
