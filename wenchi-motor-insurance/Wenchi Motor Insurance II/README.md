# Wenchi Motor Insurance II - Professional Edition

A commercial-grade motor insurance quotation platform built with **vanilla HTML, CSS, and JavaScript** frontend connected to a **Node.js/Express** backend with **MySQL** database.

🎨 **Now with Professional UI/UX** - Exhibition & live deployment ready
✨ Clean flat colour scheme (deep blue trust, emerald accents) with subtle animations and full responsiveness
🚀 Ready for real-world deployment on GitHub Pages + backend server

---

## 🏗 1️⃣ FULL ARCHITECTURE BLUEPRINT

```
Client (static HTML/CSS/JS served from GitHub Pages or simple web host)
        ↓
REST API (Node.js/Express or PHP) on a minimal server (Heroku, Render, or shared host)
        ↓
MySQL Database (managed service or local)
```

### System Components

**Frontend (HTML/CSS/JS)**
- Single page with tabbed/step flow (no framework)
- Form validation with vanilla JS
- AJAX calls using `fetch` to backend endpoints
- Simple state stored in JS objects
- Responsive layout using CSS flexbox/grid

**Backend (Node.js + Express simplest, or PHP)**
- REST endpoints for quote calculation and saving
- Input validation middleware
- Basic user session (optional) stored in memory or cookies
- MySQL connection via `mysql2` or `PDO`

**Database (MySQL)**
- `users`, `vehicles`, `quotes` tables as lightweight normalized schema

---

## 🗄 2️⃣ DATABASE SCHEMA (MySQL)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  vehicle_type VARCHAR(50),
  plate_number VARCHAR(20),
  market_value DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  vehicle_id INT,
  coverage_type VARCHAR(50),
  premium DECIMAL(12,2),
  status VARCHAR(30) DEFAULT 'generated',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
```

---

## 🌐 3️⃣ API ENDPOINTS (Plain REST)

### `POST /api/quotes/calculate`
Calculates premium without persistence.

**Request JSON**
```json
{
  "vehicleType":"Car",
  "marketValue":150000,
  "coverageType":"Comprehensive"
}
```

**Response JSON**
```json
{
  "premium":11250,
  "currency":"ZMW",
  "details":{"baseRate":0.05,"multiplier":1.5}
}
```

### `POST /api/quotes`
Saves quote along with user/vehicle details.

### `GET /api/quotes/{id}`
Retrieve saved quote details.

### `GET /api/admin/quotes`
(Optional) returns all quotes – basic auth protected.

---

## 🎨 4️⃣ UI WIREFRAME LAYOUT

1. **Landing/Start**
   - Headline: "Get an Instant Motor Insurance Quote"
   - Start button → shows step form
2. **Step 1: Personal Info**
   - Name, email, phone
   - Continue
3. **Step 2: Vehicle Details**
   - Vehicle type dropdown, market value, plate number
   - Continue
4. **Step 3: Coverage**
   - Radio buttons for coverage types
   - Calculate button
5. **Result Page**
   - Display premium, breakdown, save quote button
6. **Admin (separate page)**
   - Quote table, filter by date/coverage

---

## 🧾 5️⃣ EXACT PORTFOLIO COPY TEXT

**Hero**
> Frontend Engineer specialized in vanilla web applications and simple full‑stack flows.

**Stack line**
> HTML • CSS • JavaScript • Node.js/PHP • MySQL • REST APIs

**Project Description**

*Wenchi Motor Insurance II – Simple Quote App*
> A lightweight motor insurance quotation platform built using plain HTML, CSS and JavaScript paired with a Node.js (or PHP) backend and MySQL database. Demonstrates core form handling, AJAX integration, and server‑side calculation logic.

**About Section**
> I build clean, dependency‑free frontends backed by minimal server APIs and SQL databases. I focus on delivering business functionality using the fundamentals of web development.

---

## 📄 6️⃣ RECRUITER‑GRADE README TEMPLATE

```
# Wenchi Motor Insurance II

## Overview
A simplified motor insurance quote system using vanilla HTML/CSS/JS for the frontend and a Node.js/Express (or PHP) backend with MySQL. Ideal for demonstrating fundamental full‑stack skills without frameworks.

## Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js + Express (or PHP)
Database: MySQL
Hosting: GitHub Pages (frontend) + any small server/VPS

## Features
- Three-step quote flow
- Premium calculation engine
- REST API endpoints
- MySQL persistence
- Basic admin view

## Architecture
Static frontend → REST API → MySQL

## API Endpoints
POST /api/quotes/calculate
POST /api/quotes
GET /api/quotes/:id
GET /api/admin/quotes

## Database Schema
users, vehicles, quotes tables as shown earlier.

## Running Locally
1. Create MySQL database and run schema SQL from earlier section.
2. Copy `backend/.env.example` to `.env` and update credentials.
3. `cd backend && npm install && npm run dev` to start API (port 4000).
4. Open `frontend/index.html` in browser or serve via simple http server (e.g. `npx serve frontend`).

## Deployment
Frontend on GitHub Pages; backend on any Node/PHP host; MySQL on RDS or similar.

## Author
Wenchi
```
