# SkillSprout Backend Developer Assignment

This project implements a backend API using **Next.js** and **TypeScript**, following SkillSprout’s technical assignment requirements.

It demonstrates secure serverless design using AWS SDK (S3, DynamoDB, SQS) and Cognito authentication.

---

## 🧠 Overview

The backend contains **three REST API endpoints**:

| Endpoint | Method | Description |
|-----------|--------|--------------|
| `/api/user/profile` | GET | Validates user token (mock Cognito) and returns profile info |
| `/api/files/prepare-upload` | POST | Generates AWS S3 presigned URL for uploading files |
| `/api/submission/process` | POST | Simulates asynchronous job submission to SQS |

---

## 🧩 Technologies Used

- **Next.js (v12.2.5)** — API routes for serverless backend  
- **TypeScript (v4.5.5)** — Static typing  
- **AWS SDK v2** — S3, SQS, DynamoDB integration  
- **nanoid** — Unique file keys  
- **ESLint** — Code quality and linting

---

## ⚙️ Local Setup

### 1️⃣ Install Dependencies
```bash
npm install
