# Mosport Technical Specification V6.0 (Master Edition)

**Project Name**: Mosport (Real-time Decision Intelligence Infrastructure)  
**Version**: V6.0 (Strategic-Driven Architecture)  
**Date**: 2026-01-20  
**Status**: [APPROVED FOR IMPLEMENTATION]  
**Target Audience**: Backend Engineers, Frontend Engineers, DevOps.

---

## 1. Technical Constitution (核心技術憲法)
本章節為系統最高指導原則，任何程式碼提交 (Commit) 若違反以下原則，CI/CD 應自動拒絕。

### 1.1 The "Compare-only" Doctrine (僅比對原則)
- **No Permanent Raw Data**: 系統禁止在關聯式資料庫 (PostgreSQL) 中永久儲存第三方爬取的原始資料 (Raw HTML, Reviews, PII)。
- **TTL Caching**: 所有外部獲取的資料 (Layer A) 必須存於 Redis 或 Memcached，並設定強制 TTL (Time-To-Live)（預設 24-48 小時）。
- **Derivative Storage Only**: 資料庫僅能儲存 Mosport 產生的「比對結果」 (Derivative Works)，例如 `QoE_Score (9.0)`, `Match_Probability (95%)`, `Verification_Timestamp`.

### 1.2 Frontend Ignorance (前端無知原則)
- **Decoupled Logic**: 前端 (Layer D) 不應包含任何賽事匹配、信賴度計算或商業邏輯。
- **Signal Receiver**: 前端僅負責接收後端 (Layer C) 發出的「觸發訊號 (Triggers)」與「顯示標籤 (Tags)」。

### 1.3 Federated Identity Only (聯邦身分唯一制)
- **No Password Storage**: 資料庫 User Table 嚴禁建立 `password` 或 `password_hash` 欄位。
- **Auth Providers**: 僅支援 OAuth 2.0 / OIDC 標準 (Zalo, Google, Facebook, Instagram)。

### 1.4 The "Bundle & Ship" Doctrine (打包交付原則)
- **Node.js Mandate**: 所有 Node.js 相關服務 (Frontend/Backend) 交付時必須包含完整的打包檔案 (Bundled Artifacts)，確保可直接上傳部署。
- **Python Mandate**: Python 服務必須建立可攜式的依賴清單 (Requirements) 或虛擬環境設定，確保能被打包上傳至目標環境。
- **Future-Proof**: 任何新導入的技術或工具，都必須符合「可打包、可上傳」的交付標準，嚴禁依賴目標環境的預裝軟體。

### 1.5 The "Shadow Log" Doctrine (影子紀錄原則)
- **Local Persistence**: 凡是由 Antigravity (AI Agent) 執行的更改，必須記錄於本地檔案 `ANTIGRAVITY_LOG.md`，內容包含時間戳記與變更摘要。
- **No Cloud Sync**: 該紀錄檔必須加入 `.gitignore`，嚴禁上傳至 GitHub 或任何雲端儲存空間。

### 1.6 The "Monolingual" Doctrine (單一語言原則)
- **English Only**: 為了保持開發速度與品牌一致性，全站 UI/UX 僅支援 **English (英文)**。
- **No i18n**: 嚴禁安裝任何 i18n 函式庫 (e.g., `react-i18next`) 或建立多語系 JSON 檔案。

---

## 2. System Architecture Layers (系統分層架構)

### Layer A: Acquisition (資料取得層)
- **Role**: Stateless Workers (無狀態工兵).
- **Function**: 針對指定 URL 或 API 進行即時抓取。
- **Redundancy Strategy**: 必須實作「多源容錯」。若 Google Places API 失敗或超額，自動切換至備用來源 (OpenStreetMap / Social Parsing)。

### Layer B: The Mo Engine (核心比對與驗證層)
- **Role**: The Controller (狀態機控制器).
- **Core Modules**:
    1.  **SLME (Smart Lifecycle Management Engine)**: 決定資料冷熱，控制爬蟲頻率以節省 API 成本。
    2.  **DTSS (Dynamic Trust Scoring System)**: 執行 T-Minus 倒數驗證排程。
    3.  **QoE Audit**: 計算場所的體驗分數。

### Layer C: Decision Output (決策輸出層)
- **Role**: API Gateway / Signal Formatter.
- **Function**: 將 Layer B 的複雜運算結果轉化為簡單訊號。
    - **To B2C App**: JSON Response (包含 Vibe Tags, Action Buttons).
    - **To B2B Partners**: Data Feed (包含 Confidence Score, Event Heatmap).

### Layer D: Product Interface (產品介面層)
- **Role**: The Dashboard.
- **Function**: 渲染 UI，處理使用者互動，並將行為數據 (Clicks/Check-ins) 回傳給 Layer B 進行閉環驗證。

---

## 3. Feature Specifications (功能實作細則)

### 3.1 DTSS (Dynamic Trust Scoring System) 實作
- **Architecture**: 採用 「Controller-Worker」混合模式 (Backend Scheduler + AI Skills)。
- **Controller (Backend)**: 使用 Celery 或 APScheduler 進行確定性排程。
    - **T-7 Days (Prediction)**: 觸發 Historical_Check_Task，基於歷史慣性給出預測分。
    - **T-24 Hours (Lock-in)**: 觸發 Social_Validation_Task，檢查店家近 3 篇貼文。
    - **T-1 Hour (Live)**: 觸發 Live_Status_Task，檢查即時營業狀態。
- **Worker (AI Skill)**: 被 Controller 呼叫的 LLM 函數。
    - **Input**: 圖片/文字 -> **Output**: Boolean (Yes/No).
- **Fail-Safe Trigger**: 若 T-1 驗證失敗 (e.g., 偵測到 "Private Event")，Controller 立即向 Layer C 發送 "Interventional Alert" (阻斷預警)。

### 3.2 QoE (Quality of Experience) 評分邏輯
系統需針對每個 Venue 生成以下標籤 (Tags)，存於 Cache：
- **Liveness**: 過去 30 天內 Social Media 是否有活動？ (True/False)
- **Visual**: Big Screen (投影/大電視) vs Standard。
- **Audio**: Sound ON (有比賽聲音) vs Background Music。
- **Vibe**: Rowdy (喧鬧/High) vs Chill (安靜)。

### 3.3 Smart Caching (Cache as ATM)
- **Static Data (TTL 30 Days)**: 地點、硬體設施、周邊飯店列表。
- **Semi-Dynamic (TTL 7 Days)**: 賽程表 (Fixtures)。
- **Upsell Pre-computation**: 針對熱門賽事，預先計算 `Recommended_Hotel_ID` 並存入 Redis。當用戶點擊時，直接讀取 Redis (API Cost = $0)。

---

## 4. Security Constitution (資安實作規範)
- **API Rate Limiting**: 針對 FANS 角色實作嚴格的 IP 頻率限制 (e.g., 60 req/min)。
- **Staff Audit Logs**: 任何以 STAFF 身分進行的「寫入/修改」操作，必須寫入不可篡改的 `audit_logs` 資料表。
- **Financial Airlock**: 後端 API 禁止接收或處理信用卡號。所有支付透過 Client-side SDK (Stripe/Momo) 處理。
- **Secret Scanning**: Repository 必須啟用 Secret Scanning 與 Dependabot。

---

## 5. UI/UX Specifications (前端實作規範)

### 5.1 Global Theme (全站主題)
- **Base Background**: #000000 (Pure Black).
- **Typography**: High contrast sans-serif (Inter/Roboto).
- **Framework**: React (Vite) + Tailwind CSS.

### 5.2 Identity System (三色身分)
UI 元件 (Buttons, Badges, Borders) 需根據用戶 `role` 動態切換顏色：
- **FANS**: `#2E5296` (Deep Blue) - 消費者視角，強調信任與決策。
- **VENUES**: `#D62470` (Neon Pink) - 店家/訊號源視角，強調能量與認領。
- **STAFF**: `#FFFFFF` (Safe White) - 內部除錯模式，高亮顯示原始數據與 Log。

### 5.3 Authentication Flow (登入流程 - Soft-Gated)
策略： 所有未登入用戶啟動 App 時，必須先進入「登入著陸頁」，而非直接進入儀表板。
- **Logic**: App 啟動 -> 檢查 Token -> 若無 Token -> 顯示 `LoginLandingPage`。
- **Login Landing Page UI**:
    - **Primary Action**: Login with Zalo, Google, Facebook, Instagram
    - **Secondary Action**: "Skip for now" (Text Link / Ghost Button).
- **Behavior**:
    - 點擊 Login -> 進入 Dashboard (Full Access).
    - 點擊 Skip -> 進入 Dashboard (Guest Mode, Read-only). 執行收藏/訂閱時會再次彈出登入頁。

### 5.4 Dashboard Layout (儀表板)
- **30-Second Journey**:
    - **Top**: Global Search Bar.
    - **Feed**: "Trending Now" 賽事卡片流 (Native Ad style).
    - **Dynamic Posts**: 由 Engine 自動生成的賽事預熱內容 (e.g., "Man Utd vs Liverpool - T-24hr Check").

---

## 6. Infrastructure Stack (建議技術堆疊)
- **Backend**: Python (FastAPI) - Agent/LLM 整合首選。(目前使用 Node/Express 作為過渡，未來遷移)
- **Frontend**: React (Vite) + Tailwind CSS.
- **Database**: PostgreSQL (Metadata & Results), Redis (Caching & Raw Data).
- **Task Queue**: Celery + Redis (for DTSS scheduling).
- **LLM Integration**: OpenAI API / Anthropic API (via Gateway).
- **Hosting**:
    - **MVP**: Vercel (Frontend) + Railway/Render (Backend).
    - **Production**: AWS / GCP.
