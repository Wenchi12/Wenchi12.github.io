# Client Management Dashboard

**Stack:** React, TypeScript, Redux, PostgreSQL

An internal dashboard built to manage client records, operational reporting, and daily business workflows without overwhelming non-technical users.

## Features

- Responsive client table with virtualized rows for smooth scrolling over large datasets
- KPI summary cards for revenue, active clients, and operational health
- Redux-powered state management with clear separation between client data and UI state
- Performance-focused UI that minimizes unnecessary rerenders and keeps the interface responsive

## Local setup

```bash
cd client-management-dashboard
npm install
npm start
```

## Production build

```bash
npm run build
```

## Project structure

- `src/App.tsx` — main dashboard layout
- `src/components/ClientTable.tsx` — virtualized records table
- `src/components/DashboardStats.tsx` — KPI summary cards
- `src/store/clientsSlice.ts` — client state and reducer logic
- `public/index.html` — application entry template

