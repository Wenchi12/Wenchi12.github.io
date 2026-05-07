import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './RevenueChart.css';

const data = [
  { month: 'Jan', revenue: 4000, target: 4500 },
  { month: 'Feb', revenue: 3000, target: 4000 },
  { month: 'Mar', revenue: 5000, target: 4800 },
  { month: 'Apr', revenue: 4500, target: 5000 },
  { month: 'May', revenue: 6000, target: 5500 },
  { month: 'Jun', revenue: 5500, target: 6000 },
  { month: 'Jul', revenue: 7000, target: 6500 },
  { month: 'Aug', revenue: 6500, target: 7000 },
  { month: 'Sep', revenue: 8000, target: 7500 },
  { month: 'Oct', revenue: 7500, target: 8000 },
  { month: 'Nov', revenue: 9000, target: 8500 },
  { month: 'Dec', revenue: 8500, target: 9000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="chart-container">
      <h2>Revenue vs Target</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, '']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            strokeWidth={2}
            name="Actual Revenue"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};