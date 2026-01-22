# Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Step 1: Create Railway Project

1. Go to **https://railway.app**
2. Login with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose: `mikemm5216/Mosport`

### Step 2: Configure Service

**Root Directory**: `backend`

Railway will automatically detect:
- `railway.toml` - Build configuration
- `Procfile` - Start command
- `nixpacks.toml` - Python environment
- `requirements.txt` - Dependencies

### Step 3: Add Plugins

#### PostgreSQL (Optional if using external Neon)
- Click **+ New** → **Database** → **Add PostgreSQL**
- Railway auto-injects `DATABASE_URL`

#### Redis (Required for Scheduler + Cache)
- Click **+ New** → **Database** → **Add Redis**
- Railway auto-injects `REDIS_URL`

### Step 4: Set Environment Variables

Go to **Variables** tab and add:

```
# Already have from Neon (optional override)
DATABASE_URL=postgresql://neondb_owner:npg_6qHLaXG0cWop@ep-nameless-river-a1m3110v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# From Railway Redis plugin (auto-injected)
REDIS_URL=redis://default:password@redis.railway.internal:6379

# Scheduler Configuration
ENABLE_SCHEDULER=true
SCHEDULER_TYPE=apscheduler
MAX_CONCURRENT_JOBS=3

# SLME Frequencies (optional, has defaults)
FREQ_HOT=300
FREQ_WARM=3600
FREQ_COOL=21600
FREQ_COLD=86400

# AI/LLM (optional)
OPENAI_API_KEY=sk-your-key-here

# CORS (Important!)
BACKEND_CORS_ORIGINS=["http://localhost:5173","https://your-app.vercel.app"]
```

### Step 5: Deploy

Click **Deploy** → Railway builds and starts your backend

**Expected logs**:
```
🚀 Mosport Backend Starting...
🚀 Starting APScheduler...
📌 Registered HOT tier job (every 300s / 5min)
✅ Scheduler started successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 6: Get Public URL

1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy URL (e.g., `mosport-production.up.railway.app`)
4. Use this in Vercel:
   ```
   VITE_API_URL=https://mosport-production.up.railway.app/api/v1
   ```

---

## 🔧 Configuration Files Explained

### `railway.toml`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health` endpoint
- Restart policy: Auto-restart on failure

### `Procfile`
- Fallback if `railway.toml` not found
- Defines `web` process type

### `nixpacks.toml`
- Specifies Python 3.10
- Includes PostgreSQL client libraries
- Upgrade pip before installing dependencies

### `.railwayignore`
- Excludes `__pycache__`, `.vscode`, etc.
- Reduces deployment size

---

## 🧪 Verify Deployment

### Health Check
```bash
curl https://your-app.railway.app/health

# Expected response:
{
  "status": "ok",
  "phase": "migration_complete"
}
```

### Scheduler Verification
Check Railway logs for:
```
⏰ Scheduler triggered: HOT tier job
🔥 Processing HOT tier events...
```

### API Test
```bash
curl https://your-app.railway.app/api/v1/events

# Should return events list (or empty array)
```

---

## ⚠️ Troubleshooting

### Build fails: "Module not found"
- Check `requirements.txt` is complete
- Run locally: `pip install -r requirements.txt`

### Health check timeout
- Increase `healthcheckTimeout` in `railway.toml`
- Check Redis connection (scheduler might fail)

### Scheduler doesn't start
- Verify `REDIS_URL` is set
- Check logs for Redis connection errors
- Try `ENABLE_SCHEDULER=false` to isolate issue

### CORS errors from frontend
- Add Vercel domain to `BACKEND_CORS_ORIGINS`
- Redeploy after changing environment variables

---

## 🔄 Auto-Deploy Setup

Railway auto-deploys on every push to `main` branch.

To trigger manual deploy:
```bash
git commit -m "Trigger Railway deploy"
git push origin main
```

Or use Railway CLI:
```bash
railway up
```

---

## 🎯 Next Steps After Deploy

1. **Database Migration**:
   ```bash
   railway run alembic upgrade head
   ```

2. **Test Endpoints**:
   - `/health` - Health check
   - `/api/v1/events` - Events API
   - `/docs` - OpenAPI documentation

3. **Update Vercel**:
   - Set `VITE_API_URL` to Railway domain
   - Redeploy frontend

4. **Monitor Logs**:
   ```bash
   railway logs
   ```

---

**Deployment completed by**: Antigravity Agent  
**Date**: 2026-01-22T22:14+07:00  
**Railway Config Version**: 1.0
