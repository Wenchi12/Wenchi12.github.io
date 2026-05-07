import React from 'react';
import { ClientTable } from './components/ClientTable';
import { DashboardStats } from './components/DashboardStats';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Client Management Dashboard</h1>
      </header>
      <main>
        <DashboardStats />
        <ClientTable />
      </main>
    </div>
  );
}

export default App;