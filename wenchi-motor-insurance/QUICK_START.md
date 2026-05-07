# Wenchi Motor Insurance II - Quick Exhibition Setup Guide

## 🎯 Exhibition/Live Deployment - 5 Minute Setup

### Prerequisites Installed?
- ✅ Node.js (v14+)
- ✅ MySQL Server (v5.7+)
- ✅ Git

---

## ⚡ Step 1: Database Setup (2 min)

```bash
# Open MySQL command line or Workbench
mysql -u root -p

# Copy and paste this entire SQL block:
```

```sql
CREATE DATABASE wenchi_insurance_ii;
USE wenchi_insurance_ii;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  vehicle_type VARCHAR(50),
  plate_number VARCHAR(20),
  market_value DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  vehicle_id INT,
  coverage_type VARCHAR(50),
  premium DECIMAL(12,2),
  status VARCHAR(30) DEFAULT 'generated',
  paid_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
```

---

## ⚡ Step 2: Start Backend API (1 min)

> **Color palette**: frontend uses deep‑blue primary, emerald green accent and white backgrounds. Change the variables in `css/styles.css` and `css/admin.css` if you wish to customize.
> **Color notes**: The frontend uses a professional palette (deep blue primary, emerald accent, white background). If you customize colours edit the `:root` variables at the top of `css/styles.css` and `css/admin.css`.
```bash
cd backend

# First time only:
npm install

# Copy environment file:
cp .env.example .env

# Edit .env if needed (default settings work locally):
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=(leave empty if no password)
# DB_NAME=wenchi_insurance_ii
# PORT=4000
# JWT_SECRET=your_super_secret_key
# EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (for sending notifications)
# PAYMENT_PUBLIC_KEY, PAYMENT_SECRET_KEY (local payment gateway such as Paystack)


# Start the API:
npm run dev

# You should see:
# 🚀 API up on port 4000

### Paystack Webhook (optional but recommended)

If you use Paystack for payments, configure a webhook in your Paystack dashboard pointed at:

`https://your-backend-domain.com/api/payments/webhook`

The backend verifies Paystack signatures and will update quote status automatically when a charge succeeds.

## 🧪 Payment Testing Checklist

1. **Get Paystack test keys**
   - Login to Paystack dashboard (https://paystack.com)
   - Switch to *Test* mode and copy *Public Key* and *Secret Key*.
   - Paste `PAYMENT_PUBLIC_KEY` into `frontend/js/app.js` (replace placeholder).
   - Paste `PAYMENT_SECRET_KEY` into backend `.env`.

2. **Run backend locally** (`npm run dev`), ensure token and DB are working.
3. **Expose backend to internet** for webhook using ngrok:
   ```bash
   ngrok http 4000
   ```
   - Copy the HTTPS URL (e.g. `https://abcd1234.ngrok.io`).
   - In Paystack dashboard set webhook URL: `https://<your-url>/api/payments/webhook`.
   - Enable `charge.success` event.

4. **Create a quote** via frontend (login/signup first), save quote so `quoteId` is stored.
5. **Click "Pay Now"** and complete payment using test card details: `4084084084084081` (any CVV, future expiry).
6. After payment success, confirm the quote's `status` updates to `paid` automatically (webhook) or via `verify` button.

7. **Run reconciliation manually** (optional) from admin UI or curl:
   ```bash
   curl -X POST https://<your-url>/api/payments/reconcile \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"status":"success"}'
   ```
   - Response shows how many were reconciled.

8. **Export CSV** using the dashboard button to verify paid records.

9. **Verify database** table `quotes` has `status='paid'` and correct `paid_reference`.

10. **For production** switch Paystack to live keys and update webhook URL accordingly.
```

**✅ Backend is now running!**

---

## ⚡ Step 3: Open Frontend (1 min)

Open in browser (HTTP recommended):
```
# file:// may prevent icon/fonts from loading – use a simple server
cd frontend
python -m http.server 8000
# then open http://localhost:8000 or run `npx serve frontend`
```

Or use Python HTTP server:
```bash
cd frontend
python -m http.server 8000
# Then open http://localhost:8000
```

Or use Node live server:
```bash
npx serve frontend
# Opens http://localhost:5000 automatically
```

**✅ Frontend is now live!**

---

## ✅ Test It Works

> **Note:** sign up or log in before saving a quote. A confirmation email will be sent after quote submission. You can also click "Pay Now" to initiate a local payment (Paystack) – configure the public key in `frontend/js/app.js` and secret key in `.env`.

1. Fill out 3-step form
2. Select coverage type
3. Click "Calculate Premium"
4. See result with premium amount
5. Click "Save Quote"
6. Open admin dashboard: `admin.html`
7. See quote appears in table with stats

---

## 🎨 Professional Features Ready

✨ **Modern Design**: Clean flat colour palette, smooth animations   
📱 **Responsive**: Works on desktop, tablet, mobile   
⚡ **Fast**: No frameworks, pure HTML/CSS/JS   
💾 **Data Persistence**: MySQL database for all quotes   
📊 **Admin Dashboard**: View all quotes and analytics   

---

## 🚀 For Live Deployment

### Option 1: GitHub Pages + Render

**Frontend (GitHub Pages):**
```bash
# 1. Create repo "wenchi-motor-insurance-ii"
# 2. Push frontend folder
# 3. Enable Pages in GitHub settings
# 4. Live at: https://yourusername.github.io/wenchi-motor-insurance-ii
```

**Backend (Render.com):**
```bash
# 1. Create account on render.com
# 2. Create PostgreSQL database
# 3. Connect GitHub repo
# 4. Set environment variables
# 5. Deploy
# 6. Update API_BASE_URL in app.js
```

### Option 2: Single VPS (DigitalOcean/Linode)

```bash
# On VPS:
1. Install Node.js
2. Install MySQL
3. Upload files
4. Run: npm run dev
5. Use domain with nginx reverse proxy
```

### Option 3: Heroku + AWS RDS

```bash
# Heroku for backend:
heroku create wenchi-api
git push heroku main

# AWS RDS for MySQL:
# Create managed database
# Update .env with credentials
```

---

## 📱 Exhibition Presentation Flow

1. **Show Landing Page** - Hero with deep blue and white, features cards
2. **Demo Quote Flow** - Fill 3-step form, get instant premium
3. **Show Admin Dashboard** - All submissions with stats
4. **Highlight Responsiveness** - Switch to mobile view
5. **Discuss Code** - Show clean HTML/CSS/JS without frameworks

---

## 🔧 Troubleshooting

**Backend not starting?**
- Check MySQL is running: `mysql -u root -p`
- Check port 4000 is free: `netstat -ano | findstr :4000` (Windows)
- Check .env database credentials match your setup

**Frontend shows blank?**
- Check browser console for errors (F12)
- Make sure backend is running on port 4000
- Try refreshing page (Ctrl+F5 to hard refresh)

**Admin dashboard shows "No quotes"?**
- Submit a test quote first from main page
- Check backend logs for database errors
- Verify MySQL database tables exist

**API CORS errors?**
- Backend already has CORS enabled
- Check API_BASE_URL in app.js matches backend URL

---

## 📞 Support URLs

- **Frontend**: `http://localhost:8000` (or file:/// if static)
- **API**: `http://localhost:4000/api/quotes/calculate`
- **Admin Dashboard**: `http://localhost:8000/admin.html`

---

**Ready for Exhibition!** 🎉

All files are professionally designed and tested. Just run the 3 steps above and you're ready to impress at the exhibition.
