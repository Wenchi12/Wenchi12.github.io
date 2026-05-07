# Financial Analytics Dashboard

**Stack:** React, TypeScript, Recharts

A financial analytics dashboard built to turn dense transaction data into readable charts, summaries, and trend insights.

## Features

- Responsive Recharts line and bar charts for revenue, targets, and transaction categories
- KPI cards for high-level metrics like total revenue, growth, conversion, and active user count
- Clean dashboard layout designed to surface trends without overwhelming the user
- Focus on performance for data-heavy views and visual storytelling

## Local setup

```bash
cd financial-analytics-dashboard
npm install
npm start
```

## Production build

```bash
npm run build
```

## Project structure

- `src/App.tsx` — dashboard composition and page layout
- `src/components/KPICards.tsx` — headline metrics UI
- `src/components/RevenueChart.tsx` — revenue vs target chart
- `src/components/TransactionChart.tsx` — transaction category analytics
- `public/index.html` — page shell and metadata

