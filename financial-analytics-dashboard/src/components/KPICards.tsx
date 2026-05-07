import React from 'react';
import './KPICards.css';

const kpiData = [
  { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up' },
  { title: 'Monthly Growth', value: '8.2%', change: '+2.1%', trend: 'up' },
  { title: 'Active Users', value: '15,420', change: '-3.2%', trend: 'down' },
  { title: 'Conversion Rate', value: '3.8%', change: '+0.5%', trend: 'up' },
];

export const KPICards: React.FC = () => {
  return (
    <div className="kpi-cards">
      {kpiData.map((kpi, index) => (
        <div key={index} className="kpi-card">
          <h3>{kpi.title}</h3>
          <div className="kpi-value">{kpi.value}</div>
          <div className={`kpi-change ${kpi.trend}`}>
            {kpi.change}
          </div>
        </div>
      ))}
    </div>
  );
};