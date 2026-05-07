import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table, Column, AutoSizer } from 'react-virtualized';
import { RootState } from '../store';
import 'react-virtualized/styles.css';
import './ClientTable.css';

export const ClientTable: React.FC = () => {
  const clients = useSelector((state: RootState) => state.clients.clients);

  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => a.name.localeCompare(b.name));
  }, [clients]);

  const statusRenderer = ({ cellData }: { cellData: string }) => {
    const statusClass = `status-${cellData}`;
    return <span className={`status-badge ${statusClass}`}>{cellData}</span>;
  };

  const revenueRenderer = ({ cellData }: { cellData: number }) => {
    return <span>${cellData.toLocaleString()}</span>;
  };

  const dateRenderer = ({ cellData }: { cellData: string }) => {
    return new Date(cellData).toLocaleDateString();
  };

  return (
    <div className="client-table-container">
      <h2>Client Records</h2>
      <div className="table-wrapper">
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={width}
              height={height}
              headerHeight={50}
              rowHeight={50}
              rowCount={sortedClients.length}
              rowGetter={({ index }) => sortedClients[index]}
              className="client-table"
            >
              <Column
                label="Name"
                dataKey="name"
                width={200}
                className="table-column"
              />
              <Column
                label="Email"
                dataKey="email"
                width={250}
                className="table-column"
              />
              <Column
                label="Company"
                dataKey="company"
                width={200}
                className="table-column"
              />
              <Column
                label="Status"
                dataKey="status"
                width={100}
                cellRenderer={statusRenderer}
                className="table-column"
              />
              <Column
                label="Last Contact"
                dataKey="lastContact"
                width={120}
                cellRenderer={dateRenderer}
                className="table-column"
              />
              <Column
                label="Revenue"
                dataKey="revenue"
                width={120}
                cellRenderer={revenueRenderer}
                className="table-column"
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};