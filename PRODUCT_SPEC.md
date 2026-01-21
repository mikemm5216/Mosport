# Mosport Product Specification

> **Core Strategy:** "用 Web 承擔風險、用 App 穩住平台、用大賽加速資料飛輪"

---

## Part I: Technical Specifications
**Audience:** Professional Frontend/Backend Engineers & Architects

### 1.1 System Architecture & Data Flow

#### Layer A (Acquisition)
**Stateless Crawler Layer**
- Fetch static status from Google Places & OSM
- Cache results in Redis with 24-48hr TTL to reduce API costs

#### Layer B (Mo Engine)
**Core Logic Layer**
- Execute DTSS (Triple-Dimension Verification System)
- Run Social Analyzer
- Async task processing via Celery
- Calculate User Trust Score & Venue QoE Score

#### Layer C (Decision Output)
**API Gateway**
- Transform complex matching results into simple JSON signals
- Signal-based API design

#### Layer D (Product Interface)
**Frontend Presentation Layer**
- Built on React + Tailwind
- All-English minimalist interface

### 1.2 Triple-Verification System (DTSS)

1. **External Acquisition**: Fetch public platform static business status
2. **Active Verification (DTSS)**:
   - T-7: Prediction check
   - T-24: Lock-in check
   - T-1: Real-time check
3. **Reverse Pipeline (Authority Signal)**:
   - When users/venues login via OAuth, system directly fetches their official social posts
   - **Highest Authority Weight** in data prioritization

### 1.3 Database Design & Security

**Deployment:** AWS Singapore (ap-southeast-1) on Neon (Serverless PostgreSQL)

**Data Segmentation:**
- **Hot Zone**: Store `users`, `venues` base data
- **Vault**: Store encrypted `access_token` (AES-256 field-level encryption)
- **Dump**: Store social index with `ON DELETE CASCADE` for privacy compliance

---

## Part II: Investment Proposal
**Audience:** Senior VCs

### 2.1 Market Pain Point & Solution
Current market lacks **dynamic information** for sports viewing environments. Google Maps only provides static locations. Mosport builds the world's first **fail-safe sports decision infrastructure** through DTSS.

### 2.2 Core Moat: Bidirectional Social Index

**User Behavior Profiling:**
- Social Analyzer creates "Trust Score" based identity verification for real sports fans

**Official Data Direct Connection:**
- Venue login = data authorization
- Transform "official announcements" into structured data
- Insurmountable information barrier

**Low-Cost Expansion:**
- "Login = Authorization" mechanism
- Zero-cost automated data growth
- Avoid high maintenance costs of traditional crawlers

### 2.3 Strategic Milestones

**Phase 1 (2026/01-03):** WBC (World Baseball Classic)
- Cross-sport (baseball/football) testing
- Validate international sports fan data model

**Phase 2 (2026/06-07):** 2026 World Cup
- App launch before tournament
- Social virality: Share viewing map → Bar discount

**Phase 3 (2027-2028):** 2028 LA Olympics
- 100% sports lifestyle coverage

---

## Part III: UI/UX Design Guidelines
**Audience:** UI/UX Designers pursuing ultimate quality

**Design Core:** "Fast Decisions, High Trust."

### 3.1 Visual Language & Color System

**Base Style:**
- `#000000` (Pure Black) background
- Large white space + high contrast typography
- Professional tool aesthetic

**Identity Colors:**
- **FANS** `#2E5296` (Deep Blue): Stability & calmness for general users
- **VENUES** `#D62470` (Neon Pink): Energy & authority for official verification
- **STAFF** `#FFFFFF` (Safe White): Internal management only

### 3.2 User Journey (UX)

**Soft-Gated Entry:**
- App launches directly into Dashboard
- Login Modal only appears for high-value actions (Favorite, Claim)
- Prominent "Skip for now" button required

**30-Second Decision Framework:**
- Search bar at top
- Dynamic event cards below
- Cards must intuitively display DTSS verification badges:
  - "Authority Verified"
  - "Confirmed 1h ago"

**All-English Quality:**
- Maintain clean typography
- Avoid layout issues from multilingual translations

---

*Document Version: 2026-01-21*
*Last Updated: Initial Draft*
