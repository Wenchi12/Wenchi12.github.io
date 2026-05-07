export default function ProductCard({ product, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl bg-white p-4 border border-slate-200 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{product.location}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">
          K{product.price}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{product.seller?.name || 'Local seller'}</span>
        <span>{product.quantity} available</span>
      </div>
    </button>
  );
}
