# Wenchi Smart Market — Demo Cheat Sheet

> Read this once before you present. Keep it open during the pitch.

---

## Setup (do this BEFORE judges arrive)

```bash
# 1. Start the database (requires Docker)
docker-compose up -d

# 2. Start backend + frontend
chmod +x start.sh && ./start.sh

# 3. Seed the market with real products
cd server && npm run db:seed && cd ..
```

Then open three things on your screen:
- **Terminal** — showing server logs
- **Browser tab 1** → `http://localhost:5173` (buyer web app)
- **Browser tab 2** → `ussd-simulator/simulator.html` (seller USSD)

---

## The 90-Second Demo

### Step 1 — Show the empty seller journey
In the simulator, dial:
```
*384#
```
Select `1` → Register  
Enter name: `Mary Phiri`  
Enter location: `Soweto Market`  
→ Screen shows: **Registered!**

---

### Step 2 — List a product via USSD
Dial `*384#` again.  
Select `2` → List Product  
```
Product name:  Tomatoes
Price (K):     50
Quantity:      30
Location:      Soweto Market, Stall 7
```
→ Screen shows: **Product listed!**

---

### Step 3 — Show it on the web (THE MOMENT)
Switch to browser tab 1 → `localhost:5173`  
Refresh the page.  
**Tomatoes appear in the market feed.**

Say: *"A trader in Soweto listed that product with no internet, no smartphone — just USSD. It's now live for every buyer in Lusaka."*

---

### Step 4 — Buy it
Click **Tomatoes** → **Buy Now**  
Enter phone: `0971234567`  
Select: **MTN MoMo**  
Click: **Confirm & Pay**  
→ Screen shows: **Payment Confirmed** + transaction ID

---

### Step 5 — Show the receipt
Point to:
- Transaction ID (`WCH-...`)
- Provider: MTN MoMo
- Status: PAID
- Amount: K50

Say: *"Full financial circuit — seller lists, buyer pays, money moves — all on infrastructure built for Zambia."*

---

## If Something Goes Wrong

| Problem | Fix |
|---|---|
| Web app shows blank | Check terminal — is backend running on port 3000? |
| Simulator can't connect | Check the API URL bar in simulator — should be `http://localhost:3000` — green dot means connected |
| Products don't appear | Run `cd server && npm run db:seed` again |
| Database error | Run `docker-compose up -d` then restart with `./start.sh` |
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |

---

## Key Lines to Deliver

> *"70% of Zambia's workforce is informal. Every existing platform ignores them. Wenchi doesn't."*

> *"A trader listed that product in under 30 seconds — with no internet, no smartphone, no data costs."*

> *"We're not building an app. We're building infrastructure."*

---

## Stack (if asked)

- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Frontend**: React + Vite + Tailwind CSS
- **USSD**: Africa's Talking compatible (simulator shown here)
- **Payments**: MTN MoMo / Airtel Money / Zamtel (mock for demo, API-ready)

---

*Wenchi Smart Market — ZICTA ICT Innovation Programme*
