import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  revenue: number;
}

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      status: 'active',
      lastContact: '2024-01-15',
      revenue: 50000,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Design Studio',
      status: 'active',
      lastContact: '2024-01-10',
      revenue: 75000,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      company: 'Marketing Inc',
      status: 'inactive',
      lastContact: '2023-12-20',
      revenue: 30000,
    },
    // Add more mock data for virtualization demo
    ...Array.from({ length: 100 }, (_, i) => ({
      id: i + 4,
      name: `Client ${i + 4}`,
      email: `client${i + 4}@example.com`,
      company: `Company ${i + 4}`,
      status: Math.random() > 0.5 ? 'active' : 'inactive' as const,
      lastContact: `2024-01-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
      revenue: Math.floor(Math.random() * 100000) + 10000,
    })),
  ],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    addClient: (state, action: PayloadAction<Omit<Client, 'id'>>) => {
      const newId = Math.max(...state.clients.map(c => c.id)) + 1;
      state.clients.push({ ...action.payload, id: newId });
    },
  },
});

export const { setLoading, setError, updateClient, addClient } = clientsSlice.actions;
export default clientsSlice.reducer;