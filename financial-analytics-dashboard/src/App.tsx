import React from 'react';
import { RevenueChart } from './components/RevenueChart';
import { TransactionChart } from './components/TransactionChart';
import { KPICards } from './components/KPICards';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial Analytics Dashboard</h1>
      </header>
      <main>
        <KPICards />
        <div className="charts-container">
          <RevenueChart />
          <TransactionChart />
        </div>
      </main>
    </div>
  );
}

export default App;