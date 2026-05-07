import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { CryptoList } from './components/CryptoList';
import { PortfolioSummary } from './components/PortfolioSummary';
import './App.css';

interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({
    BTC: 0.5,
    ETH: 2.0,
    ADA: 1000,
  });

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('crypto-update', (data: CryptoData[]) => {
      setCryptoData(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const totalValue = cryptoData.reduce((sum, crypto) => {
    const holding = portfolio[crypto.symbol] || 0;
    return sum + (crypto.price * holding);
  }, 0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Crypto Tracker</h1>
        <div className="connection-status">
          Status: {socket?.connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>
      <main>
        <PortfolioSummary totalValue={totalValue} portfolio={portfolio} />
        <CryptoList cryptoData={cryptoData} portfolio={portfolio} />
      </main>
    </div>
  );
}

export default App;