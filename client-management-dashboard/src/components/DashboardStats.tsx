import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './DashboardStats.css';

export const DashboardStats: React.FC = () => {
  const clients = useSelector((state: RootState) => state.clients.clients);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0);
    const avgRevenue = totalRevenue / totalClients;

    return {
      totalClients,
      activeClients,
      totalRevenue,
      avgRevenue,
    };
  }, [clients]);

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Clients</h3>
        <div className="stat-value">{stats.totalClients}</div>
      </div>
      <div className="stat-card">
        <h3>Active Clients</h3>
        <div className="stat-value">{stats.activeClients}</div>
      </div>
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <h3>Avg Revenue</h3>
        <div className="stat-value">${Math.round(stats.avgRevenue).toLocaleString()}</div>
      </div>
    </div>
  );
};