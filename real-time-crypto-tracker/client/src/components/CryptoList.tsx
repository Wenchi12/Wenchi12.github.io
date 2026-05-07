import React from 'react';
import './CryptoList.css';

interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

interface CryptoListProps {
  cryptoData: CryptoData[];
  portfolio: { [key: string]: number };
}

export const CryptoList: React.FC<CryptoListProps> = ({ cryptoData, portfolio }) => {
  return (
    <div className="crypto-list-container">
      <h2>Market Data</h2>
      <div className="crypto-grid">
        {cryptoData.map((crypto) => {
          const holding = portfolio[crypto.symbol] || 0;
          const value = crypto.price * holding;

          return (
            <div key={crypto.symbol} className="crypto-card">
              <div className="crypto-header">
                <h3>{crypto.symbol}</h3>
                <span className="crypto-price">${crypto.price.toFixed(2)}</span>
              </div>
              <div className="crypto-stats">
                <div className="stat">
                  <span className="label">24h Change</span>
                  <span className={`value ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Volume</span>
                  <span className="value">${crypto.volume24h.toLocaleString()}</span>
                </div>
                {holding > 0 && (
                  <div className="stat">
                    <span className="label">Your Holding</span>
                    <span className="value">{holding} ({value.toFixed(2)})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};