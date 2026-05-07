import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TransactionChart.css';

const data = [
  { category: 'Online', transactions: 1200, volume: 45000 },
  { category: 'Mobile', transactions: 800, volume: 32000 },
  { category: 'In-Store', transactions: 600, volume: 28000 },
  { category: 'ATM', transactions: 400, volume: 16000 },
  { category: 'Transfer', transactions: 300, volume: 25000 },
];

export const TransactionChart: React.FC = () => {
  return (
    <div className="chart-container">
      <h2>Transaction Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="transactions" fill="#8884d8" name="Transaction Count" />
          <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};