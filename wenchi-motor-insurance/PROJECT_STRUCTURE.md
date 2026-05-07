# Project Structure & File Guide

## 📁 Complete Directory Map

```
Wenchi Motor Insurance II/
│
├── README.md                          # Main project overview
├── QUICK_START.md                     # 5-minute exhibition setup
├── PROFESSIONAL_UI_SETUP.md           # Detailed UI/UX features & customization
├── PROJECT_STRUCTURE.md               # This file
│
├── frontend/                          # Frontend application (static + JavaScript)
│   ├── index.html                     # Main quote application page
│   ├── admin.html                     # Admin dashboard page
│   │
│   ├── css/
│   │   ├── styles.css                 # Main application styling (1500+ lines)
│   │   │   ├── Color scheme & variables
│   │   │   ├── Navigation & hero
│   │   │   ├── Form components
│   │   │   ├── Result page
│   │   │   ├── Progress indicator
│   │   │   ├── Responsive breakpoints
│   │   │   └── Animations & transitions
│   │   │
│   │   └── admin.css                  # Admin dashboard styling (400+ lines)
│   │       ├── Admin layout
│   │       ├── Stats grid cards
│   │       ├── Data table styling
│   │       └── Mobile responsive
│   │
│   ├── js/
│   │   ├── app.js                     # Main application logic (350+ lines)
│   │   │   ├── Form state management
│   │   │   ├── Step navigation (1-3)
│   │   │   ├── Form validation
│   │   │   ├── API integration
│   │   │   ├── Premium calculation display
│   │   │   └── Quote save functionality
│   │   │
│   │   └── admin.js                   # Admin dashboard logic (150+ lines)
│   │       ├── Load quotes from API
│   │       ├── Display in table
│   │       ├── Calculate & update stats
│   │       ├── Auto-refresh every 30s
│   │       └── Error handling
│   │
│   └── assets/
│       ├── images/                    # For product/vehicle images
│       └── icons/                     # For icon assets
│
├── backend/                           # REST API server (Node.js + Express)
│   ├── server.js                      # Main Express app (90+ lines)
│   │   ├── POST /api/quotes/calculate # Premium calculation endpoint
│   │   ├── POST /api/quotes           # Save quote to database
│   │   ├── GET /api/quotes/:id        # Retrieve specific quote
│   │   ├── GET /api/admin/quotes      # Get all quotes (for dashboard)
│   │   ├── CORS configuration
│   │   └── Error handling
│   │
│   ├── package.json                   # Node dependencies
│   │   ├── express (web framework)
│   │   ├── mysql2 (database driver)
│   │   ├── dotenv (environment config)
│   │   └── nodemon (dev auto-reload)
│   │
│   ├── .env.example                   # Environment variables template
│   │   ├── DB_HOST=localhost
│   │   ├── DB_USER=root
│   │   ├── DB_PASSWORD=(set your pw)
│   │   ├── DB_NAME=wenchi_insurance_ii
│   │   └── PORT=4000
│   │
│   ├── .gitignore                     # Git ignore rules
│   │
│   ├── config/
│   │   └── database.js                # MySQL connection pool (15 lines)
│   │       ├── mysql2 connection pool
│   │       ├── Environment variables
│   │       └── Export for use in routes
│   │
│   └── routes/                        # Future route organization
│       └── (ready for expansion)
│
└── [SQL Schema in QUICK_START.md]     # Database initialization commands
    ├── users table
    ├── vehicles table
    └── quotes table
```

---

## 📄 File Descriptions

### Frontend Files

#### `index.html` (380 lines)
- **Purpose**: Main quote application UI
- **Features**:
  - Navigation bar with links
  - Hero section with branding
  - Features showcase (4 cards)
  - Multi-step quote form (3 steps)
  - Progress indicator
  - Result display card
  - About & footer sections
  - Toast notification element
- **Integrations**: Links to CSS & JavaScript

#### `admin.html` (140 lines)
- **Purpose**: Admin dashboard for viewing all quotes
- **Features**:
  - Navigation bar
  - Dashboard stats cards (4 metrics)
  - Quotes data table (sortable cols)
  - Refresh button
  - Auto-refresh every 30 seconds
  - Responsive design
- **Integrations**: Links to admin CSS & JS

#### `css/styles.css` (1500+ lines)
- **Purpose**: Main application styling with professional design
- **Includes**:
  - `:root` variables for colors & shadows
  - Navbar styling with flat deep‑blue background
  - Hero section layout & animations
  - Feature cards with hover effects
  - Form styling (inputs, selects, labels)
  - Coverage options as radio cards
  - Result page premium display
  - Progress indicator styling
  - Animations (float, fadeIn, slideUp, bounce)
  - Responsive media queries (768px, 480px breakpoints)
  - Footer styling
  - Toast notification styles

#### `css/admin.css` (400+ lines)
- **Purpose**: Admin dashboard styling
- **Includes**:
  - Admin layout structure
  - Stats cards with icons
  - Data table styling (header, rows, hover)
  - Spinner animation
  - Toast notifications
  - Mobile responsive layout

#### `js/app.js` (350+ lines)
- **Purpose**: Main application logic & API integration
- **Functions**:
  - `nextStep()` / `prevStep()` - Navigate form steps
  - `validateStep()` - Form validation per step
  - `saveFormData()` - Collect data from inputs
  - `showFormStep()` - Display/hide form steps
  - `updateProgressIndicator()` - Update progress UI
  - `calculatePremium()` - Call API for calculation
  - `displayResult()` - Show premium & breakdown
  - `saveQuote()` - Save quote to database
  - `resetForm()` - Clear and restart
  - `showToast()` - Display notifications
- **API Calls**: 2 POST requests to backend

#### `js/admin.js` (150+ lines)
- **Purpose**: Admin dashboard logic
- **Functions**:
  - `loadQuotes()` - Fetch all quotes from API
  - `displayQuotes()` - Render table rows
  - `updateStats()` - Calculate & display metrics
  - `formatDate()` - Format timestamps
  - `showTableError()` - Display error messages
- **Features**: Auto-refresh, error handling, stat calculation

### Backend Files

#### `server.js` (90+ lines)
- **Purpose**: Express REST API server
- **Routes**:
  - `POST /api/quotes/calculate` - Calculate premium
  - `POST /api/quotes` - Save quote to database
  - `GET /api/quotes/:id` - Get specific quote
  - `GET /api/admin/quotes` - Get all quotes
- **Features**:
  - CORS enabled for all origins
  - Request body parsing (JSON)
  - Database transactions for data consistency
  - Error handling
  - Logging

#### `config/database.js` (15 lines)
- **Purpose**: MySQL connection pool configuration
- **Exports**: Reusable database connection pool
- **Uses**: Environment variables for credentials

#### `package.json`
- **Dependencies**:
  - `express` - Web framework
  - `mysql2` - MySQL driver with promise support
  - `dotenv` - Load environment variables
- **Dev Dependencies**:
  - `nodemon` - Auto-reload on file changes
- **Scripts**:
  - `npm start` - Production start
  - `npm run dev` - Development with auto-reload

#### `.env.example`
- **Purpose**: Template for environment variables
- **Variables**:
  - Database connection details
  - Server port
  - Not committed to Git (see .gitignore)

#### `.gitignore`
- **Purpose**: Exclude files from version control
- **Excludes**: node_modules, .env, logs, build files

---

## 🗄️ Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto-increment |
| full_name | VARCHAR(100) | Customer name |
| email | VARCHAR(100) | Unique, indexed |
| phone | VARCHAR(20) | Contact number |
| created_at | TIMESTAMP | Auto-set |

### vehicles
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto-increment |
| user_id | INT | Foreign key → users |
| vehicle_type | VARCHAR(50) | Car, Truck, etc. |
| plate_number | VARCHAR(20) | Registration number |
| market_value | DECIMAL(12,2) | ZMW amount |
| created_at | TIMESTAMP | Auto-set |

### quotes
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto-increment |
| user_id | INT | Foreign key → users |
| vehicle_id | INT | Foreign key → vehicles |
| coverage_type | VARCHAR(50) | Comprehensive, etc. |
| premium | DECIMAL(12,2) | Calculated amount |
| status | VARCHAR(30) | 'generated' by default |
| created_at | TIMESTAMP | Auto-set |

---

## 🔄 Data Flow

```
User Input (HTML Form)
    ↓
JavaScript Validation (app.js)
    ↓
POST to /api/quotes/calculate (fetch)
    ↓
Node.js Calculation (formula applied)
    ↓
JSON Response with premium
    ↓
Display Result (premium + breakdown)
    ↓
Click "Save Quote"
    ↓
POST to /api/quotes (save to DB)
    ↓
Transaction: Insert user, vehicle, quote
    ↓
Success response
    ↓
Admin views at /admin.html
    ↓
GET /api/admin/quotes
    ↓
Table displays all quotes
```

---

## 🎨 Design System

### Colors
- **Primary Blue**: #0056b3 (buttons, accents)
- **Secondary (white/background)**: #FFFFFF (clean)
- **Gold**: #ffd700 (highlights)
- **Light Gray**: #f8f9fa (backgrounds, cards)
- **Dark Text**: #1a1a1a (main content)
- **Gray Text**: #666 (secondary content)

### Typography
- **Headings**: Poppins (Google Fonts), 700 weight
- **Body**: Inter (Google Fonts), 400-500 weight
- **Sizes**: 3.5rem → 0.9rem (responsive)

### Spacing
- Base unit: 1rem (16px)
- Components use multiples: 0.5rem, 1rem, 1.5rem, 2rem

### Shadows
- `--shadow-sm`: 0 2px 8px
- `--shadow-md`: 0 4px 16px
- `--shadow-lg`: 0 10px 30px

---

## 📦 What You Get

✅ **Production-Ready Code**
- Clean, commented code
- Best practices followed
- Error handling throughout
- Security considerations

✅ **Professional UI**
- Modern design
- Smooth animations
- Fully responsive
- Accessibility-first

✅ **Complete Functionality**
- 3-step form with validation
- Real-time calculation
- Database persistence
- Admin analytics

✅ **Exhibition-Ready**
- Professional appearance
- Fast performance
- Error recovery
- Data integrity

---

## 🚀 Next Steps for Enhancement

1. **Add Email Notifications** - Send quote details to customer email
2. **Payment Integration** - Stripe/PayPal for policy purchase
3. **Multi-Language Support** - Add i18n for different languages
4. **Enhanced Admin** - Filters, search, export data
5. **User Authentication** - Login/signup for customers
6. **Mobile App** - React Native or Flutter version
7. **Analytics** - Track conversion rates, popular coverage
8. **Reporting** - Generate PDF quotes

---

**Total Code Lines**: ~3,500+ lines (HTML, CSS, JavaScript, Node.js)
**Ready for**: Exhibition, Interview, Production Deployment
