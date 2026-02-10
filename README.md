# BFHL REST API

Node.js + Express API with `/health` and `/bfhl` endpoints. Uses short, human-style naming inside the code.

## Project structure

```
e:\Bajaj\
├── server.js       
├── package.json
├── .env            
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
   Edit`.env`:set `GEMINI_API_KEY` 

3. Start server:
   ```bash
   npm start
   ```
   Listens on `process.env.PORT` or `3000`.
4. Quick checks:
   - `GET http://localhost:3000/health` → `{ "is_success": true, "official_email": "MY_CHITKARA_EMAIL" }`
   - `POST http://localhost:3000/bfhl` with body `{ "fibonacci": 5 }` → `data: 5` (5th fib)




