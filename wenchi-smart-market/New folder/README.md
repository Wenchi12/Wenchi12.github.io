# Wenchi Smart Market

> USSD-first commerce infrastructure for Zambia's informal traders.

A trader in Soweto lists tomatoes in 30 seconds — no internet required.
A buyer in Lusaka finds and pays for them via the web.

---

## Project Structure

```
wenchi/
├── server/          ← Node.js + Express + Prisma (CORE ENGINE)
├── client/          ← React + Vite + Tailwind (BUYER UI)
├── ussd-simulator/  ← Standalone HTML demo tool
└── README.md
```

---

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env — set your DATABASE_URL

npm install
npx prisma migrate dev
npm run dev
# Server runs on http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. USSD Simulator

Open `ussd-simulator/simulator.html` in a browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/ussd` | USSD session handler |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders?phone=` | Orders by buyer phone |

### USSD Payload (POST /api/ussd)

```json
{
  "phoneNumber": "260971234567",
  "text": "2*Tomatoes*50*20*Soweto"
}
```

### Order Payload (POST /api/orders)

```json
{
  "productId": "clxxx",
  "buyerPhone": "260971234567",
  "quantity": 2,
  "paymentMethod": "MTN_MOMO"
}
```

---

## Demo Flow (ZICTA Pitch)

1. Open USSD simulator → dial `*384#`
2. Register as seller → list "Tomatoes K50"
3. Open web app → product appears in feed
4. Click → Buy → confirm payment
5. Payment confirmed via MTN MoMo

**That's the entire pitch.**

---

## Stack

- **Backend**: Node.js · Express · PostgreSQL · Prisma · Zod
- **Frontend**: React · Vite · Tailwind CSS
- **Payments**: Mock MTN MoMo / Airtel Money / Zamtel

---

*Built for the ZICTA ICT Innovation Programme.*
