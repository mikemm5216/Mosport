# Mosport V6

這是一個使用 Vite 和 TypeScript 構建的 React 專案。

## 專案設定 (Setup)

### 先決條件
請確保您的系統已安裝 [Node.js](https://nodejs.org/) (建議 v18 或更高版本)。

### 安裝依賴 (Installation)

```bash
npm install
```

## 開發 (Development)

啟動本地開發伺服器：

```bash
npm run dev
```

伺服器將在 `http://localhost:3000` (或其他可用端口) 啟動。

## 部署 (Deployment)

本專案包含一個 GitHub Action (`.github/workflows/deploy.yml`)，用於自動部署到 GitHub Pages。

### 手動構建 (Build)

```bash
npm run build
```

構建後的檔案將位於 `dist` 目錄中。

### 預覽 (Preview)

預覽構建後的應用程式：

```bash
npm run preview
```

## 專案結構 structure

- `src/` - 原始碼
  - `components/` - React 組件
  - `services/` - 服務邏輯 (API calls 等)
  - `App.tsx` - 主應用入口
  - `vite.config.ts` - Vite 設定檔
