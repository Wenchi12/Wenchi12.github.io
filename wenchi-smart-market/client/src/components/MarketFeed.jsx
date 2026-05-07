import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || '/api';

export default function MarketFeed({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (location) params.set('location', location);
      const res = await fetch(`${API}/products?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setProducts(json.data);
    } catch (e) {
      setError('Could not load products. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchProducts();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Wenchi Market</h1>
              <p className="text-green-200 text-xs">Lusaka's digital market</p>
            </div>
            <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
              {products.length} listings
            </span>
          </div>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-28 px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Go
            </button>
          </form>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-xl mx-auto px-4 py-4">
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm">No products found.</p>
            <p className="text-xs mt-1">Sellers can list via USSD *384#</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="flex flex-col gap-3">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => onSelectProduct(p)} />
            ))}
          </div>
        )}
      </main>

      {/* USSD badge */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-full shadow">
          Sell via USSD: <span className="font-mono font-semibold">*384#</span>
        </div>
      </div>
    </div>
  );
}
