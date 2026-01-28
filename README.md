# Pastebin Lite

A simple Pastebin-like web application that allows users to create text pastes and share them via a unique URL.  
Pastes can optionally expire based on time (TTL) or number of views.

## Features
- Create a text paste
- Generate a shareable URL
- Fetch paste content via API
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Health check endpoint

## Tech Stack
- Next.js (App Router)
- Node.js
- PostgreSQL (Neon)
- Deployed on Vercel

## API Endpoints

### Health Check
`GET /api/healthz`

Returns:
```json
{ "ok": true }
