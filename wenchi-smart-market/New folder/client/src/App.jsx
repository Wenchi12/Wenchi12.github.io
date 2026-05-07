import { useState } from 'react';
import MarketFeed from './MarketFeed.jsx';
import Confirmation from './Confirmation.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSelectProduct(product) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerPhone: '260971000000',
          quantity: 1,
          paymentMethod: 'MTN_MOMO',
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Order failed');
      }

      setResult({
        transaction: {
          product: product.name,
          seller: product.seller?.name || 'Unknown',
          amount: `K${json.data.total.toFixed(2)}`,
          provider: json.data.paymentMethod,
          status: json.data.status,
          id: json.data.id,
        },
        message: 'Your order has been placed successfully.',
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {result ? (
          <Confirmation result={result} onDone={() => setResult(null)} />
        ) : (
          <MarketFeed onSelectProduct={handleSelectProduct} />
        )}

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="rounded-3xl bg-white p-6 shadow-xl text-center">
              <p className="text-base font-semibold">Placing your order...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 z-50 rounded-2xl bg-red-600 px-4 py-3 text-white shadow-xl">
            {error}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
