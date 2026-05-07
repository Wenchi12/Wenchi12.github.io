# Wenchi Smart Market

A backend-first full-stack marketplace for Zambian farmers and traders, featuring USSD integration for offline access.

## 🚀 Features

- **USSD Integration**: Register sellers and browse/buy products via mobile USSD (*123#)
- **Web Interface**: Simple React frontend for product browsing and ordering
- **Mock Mobile Money**: Simulated payments for MTN/Airtel/Zamtel
- **Offline-First**: Core functionality works without internet

## 🏗️ Architecture

```
wenchi/
├── server/              # Node.js + Express backend
│   ├── prisma/          # Database schema
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── app.js       # Main app
│   └── package.json
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── main.jsx     # App entry
│   └── package.json
├── ussd-simulator/      # HTML USSD tester
│   └── simulator.html
└── README.md
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (optional, uses in-memory store by default)

### Backend Setup
```bash
cd server
npm install
# Optional: Set up PostgreSQL and run:
# npx prisma generate
# npx prisma db push
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### USSD Simulator
Open `ussd-simulator/simulator.html` in your browser.

## 📱 USSD Flow

1. **Dial *123#**
2. **Register as Seller**: Enter business name and location
3. **Browse Products**: Select category → Choose product → Enter quantity → Confirm purchase
4. **View Orders**: See recent orders

## 🔗 API Endpoints

- `POST /api/ussd` - Main USSD handler
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

## 🎯 Demo Script

1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Open USSD simulator in browser
4. Register a seller via USSD
5. Add products via API or directly in code
6. Browse and buy products via web or USSD

## 💡 Key Features

- **Works offline**: USSD functionality doesn't require internet
- **Fast flows**: <30 seconds for complete transactions
- **Mobile-first**: Optimized for feature phones
- **Local focus**: Built for Zambian market conditions

## 🔧 Development

- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:5173`
- USSD simulator: Open HTML file directly

## 📈 Next Steps

- Add real mobile money integration
- Implement seller dashboard
- Add product categories and search
- Deploy to production with proper database