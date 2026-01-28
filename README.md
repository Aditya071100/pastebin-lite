# Pastebin Lite

A lightweight Pastebin-like application built using Next.js.

## Features
- Create text pastes
- Generate unique paste IDs
- Retrieve paste content via API
- Optional expiration (TTL)
- Limited number of views

## Tech Stack
- Next.js (Frontend + API routes)
- TypeScript
- PostgreSQL (NeonDB)
- Vercel (Deployment)

## Live Demo
https://pastebin-lite-beta-weld.vercel.app

## API Usage

### Create Paste
POST /api/pastes

```json
{
  "content": "Hello World",
  "ttl_seconds": 300,
  "max_views": 3
}
