# Railway 部署 Mo Engine 搜尋系統

## 快速部署（自動 Migration）

你的專案已經設定好自動執行 migration：

1. **Push 到 GitHub**:
   ```bash
   git add .
   git commit -m "Add Mo Engine search system"
   git push origin main
   ```

2. **Railway 自動部署**:
   - Railway 偵測到 push，自動觸發部署
   - 啟動時會自動執行 `database/migrations/001_search_engine.sql`
   - Migration 完成後啟動 backend

3. **檢查 logs**:
   ```bash
   railway logs
   ```
   
   應該看到：
   ```
   🚀 Mosport Backend Starting...
   📦 Running database migrations...
   ✅ Migrations completed successfully
   🔥 Starting Uvicorn...
   ```

---

## 手動執行 Migration（如果已經部署）

如果你的 Railway 專案已經在跑，想手動執行 migration：

### 方法 1: Railway CLI

```bash
# 安裝 Railway CLI
npm i -g @railway/cli

# 登入
railway login

# 連結專案
railway link

# 執行 migration
railway run psql $DATABASE_URL -f database/migrations/001_search_engine.sql
```

### 方法 2: Railway Dashboard

1. 去 Railway Dashboard → 你的專案
2. 點擊 PostgreSQL 服務
3. 點擊 **Data** tab
4. 點擊 **Query** → 貼上 `database/migrations/001_search_engine.sql` 內容
5. 執行

---

## 驗證部署

```bash
# 測試搜尋 API
curl "https://你的railway網址.railway.app/api/v1/search/trending"

# 測試搜尋
curl "https://你的railway網址.railway.app/api/v1/search/venues?q=football&lat=21.0285&lon=105.8542"
```

---

## 更新 Frontend 的 API URL

在你的 frontend `.env.production`:

```bash
VITE_API_URL=https://你的railway網址.railway.app
```

完成！
