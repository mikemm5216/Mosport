# Security Policy

Thank you for your interest in the security of Mosport. As a platform built on a **Real-time Decision Intelligence Infrastructure**, we take data privacy and architectural security seriously.

This document outlines our security philosophy, supported versions, and the process for reporting vulnerabilities.

## Core Security Philosophy

Our security model is based on **Data Minimalism** and **Architectural Isolation**. Security researchers should be aware of the following architectural principles:

1.  **Zero-Retention Doctrine:** We do not permanently store scraped PII or external raw data. All data follows a strict TTL (Time-To-Live) policy in cache.
2.  **Federated Identity:** We do not store user passwords. Authentication is handled exclusively via OAuth 2.0 / OIDC (Zalo, Google, Facebook).
3.  **Compare-only Engine:** Our backend outputs decision signals, not raw data dumps.

### Infrastructure & Data Isolation

**Deployment Environment:**
- **Region:** AWS Singapore (`ap-southeast-1`)
- **Database:** Neon (Serverless PostgreSQL)

**Three-Layer Data Segmentation:**
- **Hot Zone:** Base data for `users` and `venues` (public profile info)
- **Vault:** Encrypted `access_token` storage with **AES-256 field-level encryption**
- **Dump:** Social index cache with `ON DELETE CASCADE` for automatic privacy compliance

**Encryption Standards:**
- OAuth tokens: AES-256-GCM with per-record unique IV
- Database-level encryption: Neon managed encryption at rest
- TLS 1.3 for all data in transit

## Supported Versions

Mosport operates primarily as a SaaS (Software as a Service) platform. Therefore, only the most recent deployment is actively supported.

| Version | Status | Description |
| :--- | :--- | :--- |
| **Current** | :white_check_mark: | **Active Support.** The current production environment implementing the Compare-only Engine architecture. |
| v5.x (Legacy) | :x: | **End of Life.** Previous architecture based on Affiliate-only logic. No longer maintained. |
| < v5.0 | :x: | **End of Life.** Prototype versions. |

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Mosport (Web App, API, or Mo Engine), we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.

### How to Report

Please email your findings to **security@mosport.app** (Replace with your actual email).
* **Subject:** `[Security Report] - <Vulnerability Title>`
* **Content:** Please include a Proof of Concept (PoC) or detailed steps to reproduce the issue.

### Our Response Timeline
* **Acknowledgment:** We will aim to acknowledge your report within **48 hours**.
* **Triage:** We will determine the severity and impact within **5 business days**.
* **Resolution:** We aim to resolve critical vulnerabilities within **14 days**.

### Safe Harbor (Research Rules)

We pledge not to initiate legal action against researchers for penetrating or attempting to penetrate our systems as long as they adhere to this policy:

* **Do not** access, modify, or delete data belonging to other users (FANS/VENUES).
* **Do not** execute Denial of Service (DDoS) attacks.
* **Do not** use social engineering or phishing against our employees or venue partners.
* **Do not** make the vulnerability public until we have had reasonable time (90 days) to address it.

## Scope

### :dart: In Scope
* **Web Application:** `https://mosport.app` (and related subdomains)
* **API Endpoints:** `https://api.mosport.app`
* **Authentication Flow:** Bypassing Zalo/Google login, Privilege Escalation (e.g., acting as STAFF when logged in as FAN).
* **Engine Logic:** Manipulation of QoE scores or Cache Poisoning.

### :no_entry_sign: Out of Scope
* **Data Accuracy:** "The match time listed is wrong" is a data quality issue, not a security vulnerability.
* **Third-Party Providers:** Vulnerabilities hosted on Zalo, Google, or Facebook domains.
* **Clickjacking** on pages with no sensitive actions.

## Hall of Fame

While we do not currently offer a cash Bug Bounty program, we are happy to feature researchers who make significant contributions to Mosport's security on our [Contributors Page] (coming soon).

---
*Policy last updated: January 2026*
