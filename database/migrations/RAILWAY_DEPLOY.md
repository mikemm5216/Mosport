# Railway 部署快速修正

## 問題
Railway build 失敗，因為路徑配置錯誤。

## 解決方案

已修正：
- `railway.toml` buildCommand 路徑
- `start.sh` 腳本的 migration 路徑

## 重新部署

```bash
git add .
git commit -m "Fix Railway build paths"
git push origin main
```

Railway 會自動重新部署，這次應該會成功！

---

## 如果還是失敗

**簡單方案**：先不自動 migration，手動執行

### 1. 改回簡單的 startCommand

在 Railway Dashboard → Settings → Deploy → 編輯 `railway.toml`:

```toml
[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

### 2. 手動執行 migration

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

完成！
