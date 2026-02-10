# BFHL REST API

Node.js + Express API with `/health` and `/bfhl` endpoints. Uses short, human-style naming inside the code.

## Project structure

```
e:\Bajaj\
├── server.js       # single entry, all routes + helpers
├── package.json
├── .env            # create from .env.example (not committed)
├── .env.example
└── README.md
```

## Run locally

1. Install deps:
   ```bash
   npm install
   ```

2. Copy env and set your values:
   ```bash
   copy .env.example .env
   ```
   Edit `.env`: set `GEMINI_API_KEY` (and optional `PORT`).

3. Start server:
   ```bash
   npm start
   ```
   Listens on `process.env.PORT` or `3000`.

4. Quick checks:
   - `GET http://localhost:3000/health` → `{ "is_success": true, "official_email": "MY_CHITKARA_EMAIL" }`
   - `POST http://localhost:3000/bfhl` with body `{ "fibonacci": 5 }` → `data: 5` (5th fib)

## Deploy on Render

1. Create a **Web Service**; connect your repo (or push this folder to GitHub).
2. Build: **npm install**
3. Start: **npm start**
4. In **Environment** add:
   - `GEMINI_API_KEY` = your key
   - (optional) `PORT` — Render sets this automatically; no need to set if not required.
5. Deploy. Base URL = `https://<your-service>.onrender.com`. Use `/health` and `/bfhl` as above.

## Deploy on Railway

1. New project → **Deploy from GitHub** (or upload this folder).
2. In **Variables** add:
   - `GEMINI_API_KEY` = your key
   - (optional) `PORT` — Railway usually sets it.
3. Start command: **npm start** (or leave default if it runs `npm start`).
4. Deploy; use the generated URL for `/health` and `/bfhl`.

## API summary

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | /health  | Returns `is_success`, `official_email`. |
| POST   | /bfhl    | Body must have **exactly one** key: `fibonacci`, `prime`, `lcm`, `hcf`, or `AI`. Response: `is_success`, `official_email`, `data`. |

Errors: appropriate 4xx/5xx status and body `{ "is_success": false, "error": "message" }`.
