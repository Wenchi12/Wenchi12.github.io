# Wenchi Motor Insurance II - Professional UI/UX Setup

## 🎨 UI/UX Features

✅ **Commercial-Grade Design**
- Modern gradient backgrounds (primary: #0056b3, secondary: #00a8e8)
- Professional typography (Poppins for headings, Inter for body)
- Smooth animations and transitions
- Box shadows and depth effects
- Responsive grid layouts

✅ **Complete Pages**
- Landing page with hero section
- Multi-step quote form with progress indicator
- Professional result card with premium display
- About section
- Contact footer

✅ **Authentication & Security**
- Login / signup flow with JWT tokens
- Save quote functionality restricted to logged–in users

✅ **Email Notifications**
- Automatic quote email sent via Nodemailer after submission

✅ **Payment Integration**
- Local gateway (Paystack) support with inline checkout
- "Pay Now" button appears after quote is saved

✅ **Interactive Elements**
- Step-by-step form navigation (validate before proceeding)
- Real-time progress tracking
- Toast notifications for user feedback
- Animated buttons and hover states
- Floating animations on hero image

✅ **Responsive Design**
- Mobile-first approach with breakpoints at 768px and 480px
  - Collapsible hamburger menu appears on tablets/phones (tap the bars icon to open/close navigation)
- Hero, form, and feature grids collapse to single‑column on tablets/phones
- Navbar and buttons scale down, fonts adjust for readability
- Admin dashboard tables shrink and padding reduces for small screens
- Desktop full-width layouts stay clean with defined max-widths
- Touch-friendly buttons and inputs

## 📁 Project Structure

```
Wenchi Motor Insurance II/
├── frontend/
│   ├── index.html              # Main application
│   ├── css/
│   │   └── styles.css          # Professional styling (1200+ lines)
│   ├── js/
│   │   └── app.js              # Form logic & API calls
│   └── assets/
│       ├── images/             # Product images (add your own)
│       └── icons/              # Icon assets
├── backend/
│   ├── server.js               # Express API
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   ├── config/
│   │   └── database.js         # MySQL connection
│   └── routes/
│       └── (future route files)
└── README.md                    # Project overview
```

## 🚀 Quick Start for Exhibition/Live Deployment

> **New Features**: authentication, email notifications, local payment support (Paystack), and Font Awesome icons have been added. Users must sign up/login before saving quotes; the backend will email them quote details after submission.


### Step 1: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wenchi_insurance_ii
PORT=4000
```

### Step 2: Create MySQL Database

```sql
CREATE DATABASE wenchi_insurance_ii;

USE wenchi_insurance_ii;

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

### Step 3: Start Backend

```bash
npm run dev
# Should output: API up on 4000
```

### Step 4: Open Frontend

Option A: Direct
- Open `frontend/index.html` in your browser

Option B: With Python
```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000
```

Option C: With Node
```bash
npx serve frontend
```

## 🎯 Key Professional Features

### Color Scheme

### Icons
- **Font Awesome** CDN included throughout the UI for scalable vector icons (user, lock, car, email, etc.)
  - *Note:* icons are loaded from the Internet; when testing locally use a simple HTTP server (`python -m http.server` or `npx serve`) or deploy to avoid file:// restrictions. If the icons don’t appear, check your network connection or try serving over HTTP.
- Custom SVGs remain available in `assets/icons` for proprietary imagery.

- **Primary**: #0056b3 (Professional Blue)
- **Secondary**: #00a8e8 (Accent Blue)
- **Accent**: #ffd700 (Gold highlight)
- **Backgrounds**: White and light gray (#f8f9fa)

### Typography
- **Headings**: Poppins (700 weight, bold)
- **Body**: Inter (400-500 weight, readable)
- **Font sizes**: Scaled proportionally for hierarchy

### Spacing & Layout
- Max-width: 1200px for content
- Responsive grids with auto-fit
- Consistent padding/margins
- Mobile-first breakpoints (480px, 768px)

### Animations
- Flat buttons with hover opacity
- Form step transitions (fade-in)
- Float effect on hero image
- Bounce animation on success icon
- Slide-in toast notifications

## 📋 Form Flow

1. **Step 1: Personal Information**
   - Full Name, Email, Phone
   - Validation before next step

2. **Step 2: Vehicle Details**
   - Vehicle Type (dropdown with 6 options)
   - Market Value (numeric input)
   - Registration Number (optional)

3. **Step 3: Coverage Selection**
   - Third Party (basic)
   - Third Party + Fire & Theft
   - Comprehensive (full coverage)
   - Radio button selection

4. **Calculate & Display Result**
   - Premium amount highlighted
   - Calculation breakdown
   - Quote details summary
   - Save or get another quote

## 🌐 For Live Deployment

### Frontend Deployment (GitHub Pages)

1. Create GitHub repo: `wenchi-motor-insurance-ii`
2. Push `frontend/` folder contents
3. Enable GitHub Pages in settings
4. Site will be live at: `https://yourusername.github.io/wenchi-motor-insurance-ii`

### Backend Deployment

Option 1: **Render.com**
- Connect GitHub repo
- Set environment variables
- Deploy backend to private URL

Option 2: **Railway.app**
- Sign up with GitHub
- Create new service
- Connect MySQL instance
- Deploy

Option 3: **DigitalOcean/AWS VPS**
- Create VM
- Install Node & MySQL
- Deploy and run

### Update API URL

In `frontend/js/app.js`, update:
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 📱 Progressive Web App (PWA)

Frontend pages include a `manifest.json` and register `sw.js` service worker. The worker caches essential files so the app continues to function offline. When served over HTTPS, browsers will prompt users to "Install" or "Add to Home Screen."

Make sure the manifest and service worker files are accessible from the root of the deployed site.

## 📱 Exhibition Checklist

- [ ] Backend running and tested locally
- [ ] MySQL database populated with schema
- [ ] Frontend loads without errors
- [ ] Quote calculation works end-to-end
- [ ] Responsive design tested on phone/tablet
- [ ] Animation smooth and professional
- [ ] Colors and branding consistent
- [ ] All buttons clickable and functional
- [ ] Toast notifications working
- [ ] No console errors

## 🎨 Customization Tips

### Change Colors
Edit `:root` variables in `frontend/css/styles.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-accent;
  ...
}
```

### Add Logo
Replace emoji shield (🛡️) in navbar with image:
```html
<img src="assets/images/logo.png" alt="Logo" class="logo-image">
```

### Add Background Images
Replace SVG hero graphic with image or use CSS `background-image`

### Change Premium Multipliers
Edit backend `server.js` calculation logic

## 📞 Support

For deployment issues, check:
1. MySQL is running
2. Backend API responds to `http://localhost:4000/health`
3. Frontend `App.js` API_BASE_URL is correct
4. CORS might need configuration in backend

---

**Ready for Exhibition & Live Deployment!**
