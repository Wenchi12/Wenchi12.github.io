export default function Confirmation({ result, onDone }) {
  if (!result) return null;
  const { transaction, message } = result;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full flex flex-col gap-4">

        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Payment Confirmed</h2>
          <p className="text-sm text-gray-400 mt-1">{message}</p>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Receipt</p>
          <div className="flex flex-col gap-3 text-sm">
            <Row label="Product" value={transaction.product} />
            <Row label="Seller" value={transaction.seller} />
            <Row label="Amount" value={<span className="text-green-700 font-semibold">{transaction.amount}</span>} />
            <Row label="Provider" value={transaction.provider} />
            <Row label="Status" value={
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {transaction.status}
              </span>
            } />
            <div className="border-t border-gray-100 pt-3">
              <Row label="Transaction ID" value={
                <span className="font-mono text-xs text-gray-500">{transaction.id}</span>
              } />
            </div>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl text-base active:scale-95 transition-all"
        >
          Back to Market
        </button>

        <p className="text-center text-xs text-gray-400">
          Wenchi Smart Market · Lusaka, Zambia
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
