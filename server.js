require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const OFFICIAL_EMAIL = 'prashansa1017.be23@chitkara.edu.in';

app.use(express.json());

/* helpers */
function fibSeries(n) {
  const arr = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    arr.push(a);
    [a, b] = [b, a + b];
  }
  return arr;
}
function isPrime(x) {
  if (!Number.isInteger(x) || x < 2) return false;
  if (x === 2) return true;
  if (x % 2 === 0) return false;
  for (let i = 3; i * i <= x; i += 2) {
    if (x % i === 0) return false;
  }
  return true;
}
function primesFromArr(arr) {
  if (!Array.isArray(arr)) return null;
  return arr.filter(n => Number.isInteger(n) && isPrime(n));
}

function gcd(a, b) {
  a= Math.abs(a);
  b= Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a %b;
    a= t;
  }
  return a;
}

function lcmTwo(a, b) {
  if (a=== 0 || b === 0) return 0;
  return Math.abs(a * b)/gcd(a, b);
}

function lcmOfArr(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let res= Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    if (!Number.isInteger(arr[i])) return null;
    res = lcmTwo(res, arr[i]);
  }
  return res;
}

function hcfOfArr(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let res = Math.abs(arr[0]);
  for (let i= 1; i <arr.length; i++) {
    if (!Number.isInteger(arr[i])) return null;
    res = gcd(res, arr[i]);
  }
  return res;
}

async function askGemini(q) {
  const key= process.env.GEMINI_API_KEY;
  if (!key || typeof q !== 'string' || !q.trim()) return null;

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `gemini-pro:generateContent?key=${key}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: q }] }],
        generationConfig: {
          temperature:0.1,
          maxOutputTokens: 50
        }
      })
    });

    if (!resp.ok) return null;

    const js = await resp.json();
    const txt = js?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!txt) return null;

    return txt.trim().split(/\s+/)[0];
  } catch (e) {
    return null;
  }
}

/* api routes */
app.get('/', (req, res) => {
  res.redirect(302, '/api/health');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    is_success:true,
    official_email:OFFICIAL_EMAIL
  });
});

app.post('/api/bfhl', async (req, res) => {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      is_success: false,
      error: 'Invalid request body'
    });
  }

  const keys= Object.keys(body);
  if (keys.length !== 1) {
    return res.status(400).json({
      is_success: false,
      error: 'Exactly one key is required'
    });
  }

  const k =keys[0];
  const v= body[k];
  let data;

  if (k === 'fibonacci') {
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) {
      return res.status(400).json({
        is_success: false,
        error: 'fibonacci must be a positive integer'
      });
    }
    data= fibSeries(n);
  }

  else if (k === 'prime') {
    const out = primesFromArr(v);
    if (out === null) {
      return res.status(400).json({
        is_success: false,
        error: 'prime must be an array of integers'
      });
    }
    data= out;
  }

  else if (k === 'lcm') {
    const out = lcmOfArr(v);
    if (out=== null) {
      return res.status(400).json({
        is_success: false,
        error:'lcm must be a non-empty integer array'
      });
    }
    data= out;
  }

  else if (k === 'hcf') {
    const out =hcfOfArr(v);
    if (out=== null) {
      return res.status(400).json({
        is_success: false,
        error: 'hcf must be a non-empty integer array'
      });
    }
    data= out;
  }

  else if (k=== 'AI') {
    const ans= await askGemini(v);
    if (!ans) {
      return res.status(503).json({
        is_success: false,
        error:'AI service unavailable'
      });
    }
    data =ans;
  }

  else {
    return res.status(400).json({
      is_success:false,
      error:'Invalid key'
    });
  }

  res.status(200).json({
    is_success:true,
    official_email:OFFICIAL_EMAIL,
    data
  });
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    error:'Not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});