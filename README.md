# Twilio Messenger — Developer Setup Guide

A full-stack messaging app built with React + Vite (frontend) and Node.js + Express (backend), powered by the Twilio API.

---

## Prerequisites

Make sure the following are installed on your machine before you begin:

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or higher | `node -v` |
| npm | 9 or higher | `npm -v` |
| Git | Any recent version | `git --version` |

You will also need a free **Twilio account** — sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio).

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/twilio-messenger.git
cd twilio-messenger
```

---

## Step 2 — Install dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

## Step 3 — Configure environment variables

The app uses `.env` files to store secret keys. These are **never committed to Git**.

### Backend — `server/.env`

Create the file:

```bash
cd server
cp .env.example .env
```

Then open `server/.env` and fill in your values:

```env
# ─────────────────────────────────────────────
# Twilio Credentials
# Find these at: https://console.twilio.com
# ─────────────────────────────────────────────

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# The Twilio phone number assigned to your account
# Format: E.164  e.g. +14155238886
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# ─────────────────────────────────────────────
# Server
# ─────────────────────────────────────────────

PORT=3001
```

### Frontend — `client/.env`

```bash
cd ../client
cp .env.example .env
```

Open `client/.env`:

```env
# ─────────────────────────────────────────────
# API Base URL
# In development this points to your local server
# ─────────────────────────────────────────────

VITE_API_BASE_URL=http://localhost:3001
```

> **Note:** In React + Vite, all environment variables exposed to the browser must start with `VITE_`.

---

## Step 4 — Find your Twilio credentials

### Account SID and Auth Token

1. Log in to the [Twilio Console](https://console.twilio.com)
2. On the dashboard, you will see **Account SID** and **Auth Token**
3. Click the eye icon next to Auth Token to reveal it
4. Copy both values into `server/.env`

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

### Twilio Phone Number

1. In the Twilio Console, go to **Phone Numbers → Manage → Active Numbers**
2. If you have no number, click **Buy a Number** (free trial credit covers this)
3. Copy the number in E.164 format (e.g. `+14155238886`)
4. Paste it into `server/.env` as `TWILIO_PHONE_NUMBER`

---

## Step 5 — WhatsApp Sandbox (for WhatsApp messages)

Twilio provides a free sandbox for testing WhatsApp without business approval.

1. In the Twilio Console, go to **Messaging → Try it out → Send a WhatsApp message**
2. Note the sandbox number and the join code shown on the page (e.g. `join bright-river`)
3. From the **recipient's WhatsApp**, send that join code to the sandbox number
4. Once they receive a confirmation reply, they are connected to the sandbox
5. Use the **sandbox number** as your `TWILIO_PHONE_NUMBER` for WhatsApp testing

> For production WhatsApp (sending to anyone without a join step), apply for a WhatsApp Business Profile at [twilio.com/whatsapp](https://www.twilio.com/whatsapp).

---

## Step 6 — Run the app

Open two terminal windows.

**Terminal 1 — start the backend:**

```bash
cd server
node index.js
```

You should see:

```
Server running → http://localhost:3001
```

**Terminal 2 — start the frontend:**

```bash
cd client
npm run dev
```

You should see:

```
VITE ready in Xms → http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Project structure

```
twilio-messenger/
│
├── client/                     ← React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             ← Main UI component
│   │   └── services/
│   │       └── api.js          ← Axios instance (reads VITE_API_BASE_URL)
│   ├── .env                    ← Frontend env vars (not committed)
│   ├── .env.example            ← Template — safe to commit
│   └── vite.config.js
│
├── server/                     ← Node.js + Express backend
│   ├── index.js                ← Express server + Twilio routes
│   ├── .env                    ← Backend env vars (not committed)
│   └── .env.example            ← Template — safe to commit
│
├── .gitignore
└── README.md
```

---

## services/api.js

This is the Axios instance used in `App.jsx`. It reads the base URL from your frontend `.env`:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

---

## Phone number format

All phone numbers must be in **E.164 format** — a `+` sign, country code, then the number. No spaces, dashes, or brackets.

| Country | Correct format | Wrong format |
|---|---|---|
| India | `+919876543210` | `09876543210` or `98765 43210` |
| USA | `+14155551234` | `(415) 555-1234` |
| UK | `+447911123456` | `07911 123456` |
| UAE | `+971501234567` | `0501234567` |

---

## Common errors

| Error code | Message | Cause | Fix |
|---|---|---|---|
| `21608` | Unverified number | Trial accounts can only message verified numbers | Add the number at **Console → Verified Caller IDs** |
| `21211` | Invalid 'To' number | Wrong phone number format | Use E.164 format |
| `63007` | Channel unavailable | WhatsApp recipient hasn't joined the sandbox | Ask them to send the join code first |
| `20003` | Authentication error | Wrong SID or Auth Token | Re-check `.env` values from the Console |
| — | `Network Error` in browser | Backend not running or wrong port | Make sure `node index.js` is running on port 3001 |

---

## .gitignore

Make sure your `.gitignore` includes the following so secrets are never committed:

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build output
dist/
```

---

## Security checklist before going public

- [ ] `.env` files are listed in `.gitignore`
- [ ] Auth Token is only in the backend `.env` — never in frontend code
- [ ] Phone numbers are validated server-side before calling Twilio
- [ ] CORS is restricted to your frontend domain (not `*`) in production
- [ ] Rate limiting is added to the API routes (use `express-rate-limit`)
- [ ] `console.log` statements with sensitive data are removed
