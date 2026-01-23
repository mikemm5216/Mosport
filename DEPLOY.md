# Mosport Frontend CI/CD 設定指南

## 為什麼本地有 TypeScript 錯誤？

本地環境沒有安裝 Node.js 和依賴，所以 IDE 會顯示類型錯誤。這些錯誤**不影響部署**，因為構建是在 GitHub Actions 雲端環境進行的。

## GitHub Secrets 設定

需要在 GitHub Repository Settings → Secrets and variables → Actions 中添加以下 secrets：

### 必需的 Secrets

1. **VITE_API_URL**
   - Backend API 地址
   - 例如：`https://mosport-api.railway.app`

2. **VITE_GOOGLE_CLIENT_ID**
   - Google OAuth Client ID
   - 從 Google Cloud Console 獲取

3. **VITE_FACEBOOK_APP_ID**
   - Facebook App ID
   - 從 Facebook Developers 獲取

4. **VITE_ZALO_APP_ID**
   - Zalo App ID
   - 從 Zalo Developers 獲取

## 部署流程

### 自動部署
推送到 `main` branch 時，如果有前端文件變更，會自動觸發部署：
- `src/**` - 源碼
- `public/**` - 靜態資源
- `index.html` - 入口文件
- `package.json` - 依賴配置
- `vite.config.ts` - 構建配置

### 手動部署
在 GitHub Actions 頁面點擊 "Run workflow" 手動觸發

## 構建步驟

1. **Checkout** - 拉取代碼
2. **Setup Node.js** - 安裝 Node.js 20
3. **Install** - `npm install` 安裝依賴
4. **Build** - `npm run build` 構建生產版本
5. **Deploy** - 部署到 GitHub Pages

## GitHub Pages 設定

1. 進入 Repository Settings → Pages
2. Source 選擇 "GitHub Actions"
3. 部署後自動獲得 URL：`https://<username>.github.io/<repo-name>/`

## 查看部署狀態

- GitHub Actions 頁面查看構建日誌
- 綠色勾 = 成功
- 紅色叉 = 失敗（查看日誌修復）

## 本地開發的替代方案

如果無法安裝 Node.js，可以：
1. 直接在 GitHub 編輯代碼，讓 CI 構建
2. 使用 GitHub Codespaces 或 GitPod 線上開發環境
3. 使用其他有 Node.js 的機器進行開發
