# Real-Time Crypto Tracker

**Stack:** React, Node.js, Socket.io

A full-stack crypto dashboard that delivers live price updates and portfolio value calculations over WebSockets.

## Features

- Real-time market updates using Socket.io
- Portfolio summary that calculates holdings value from current prices
- Market cards with price, 24h change, volume, and personal holding value
- Connection status indicator for live feed health

## Local setup

```bash
cd real-time-crypto-tracker/client
npm install
npm start
```

In a separate terminal:

```bash
cd real-time-crypto-tracker/server
npm install
npm start
```

## Project structure

- `client/src/App.tsx` — React client and socket connection logic
- `client/src/components/CryptoList.tsx` — market asset cards
- `client/src/components/PortfolioSummary.tsx` — portfolio value summary
- `server/server.js` — Socket.io server and market simulation

