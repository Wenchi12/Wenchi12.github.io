import React from 'react';
import './PortfolioSummary.css';

interface PortfolioSummaryProps {
  totalValue: number;
  portfolio: { [key: string]: number };
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ totalValue, portfolio }) => {
  return (
    <div className="portfolio-summary">
      <h2>Portfolio Summary</h2>
      <div className="summary-card">
        <div className="total-value">
          <span className="label">Total Value</span>
          <span className="value">${totalValue.toFixed(2)}</span>
        </div>
        <div className="holdings">
          <h3>Your Holdings</h3>
          <ul>
            {Object.entries(portfolio).map(([symbol, amount]) => (
              <li key={symbol}>
                <span className="symbol">{symbol}</span>
                <span className="amount">{amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};