import CustomerOrderLayout from '~/layout/CostumersOrderLayout'

export default function ActiveOrderPage({ data }: any) {
  const session = data
  const orders = data.orders || []

  const formatRp = (v: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

  return (
    <CustomerOrderLayout sessionToken={session.sessionToken}>
      <h1 className="p-6 text-3xl font-bold text-orange-600 mb-4">🍽️ Pesanan Aktif</h1>

      {/* SESSION INFO */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold">Meja: {session.table.tableNumber}</h2>
        <p className="text-gray-600 text-sm mt-1">
          Session: <span className="font-mono">{session.sessionToken}</span>
        </p>
      </div>

      {/* JIKA TIDAK ADA ORDER */}
      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">Belum ada pesanan.</p>
      )}

      {/* DAFTAR ORDER */}
      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl shadow p-5">
            {/* HEADER ORDER */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-600">Order #{order.orderCode}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'cooking'
                    ? 'bg-orange-500 text-white'
                    : order.status === 'served'
                      ? 'bg-green-500 text-white'
                      : order.status === 'pending'
                        ? 'bg-gray-400 text-white'
                        : 'bg-blue-500 text-white'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* TOTAL */}
            <div className="mt-2 text-sm text-gray-700">
              <p>Subtotal: {formatRp(order.subtotal)}</p>
              <p>Pajak: {formatRp(order.tax)}</p>
              <p className="font-bold text-lg mt-1">Total: {formatRp(order.total)}</p>
            </div>

            {/* ITEMS */}
            <div className="mt-4 space-y-3">
              {order.items.map((i: any) => (
                <div
                  key={i.id}
                  className="flex gap-4 bg-gray-50 rounded-xl p-3 border border-gray-200"
                >
                  <img
                    src={i.menuItem.imageUrl ?? 'https://source.unsplash.com/300x200/?meal'}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{i.menuItem.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Qty: <span className="font-semibold">{i.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Status:{' '}
                      <span className="font-bold capitalize text-green-600">{i.status}</span>
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-right font-semibold text-sm">{formatRp(i.price)}</div>
                </div>
              ))}
            </div>

            {/* PAYMENT INFO */}
            {order.payment && (
              <div className="mt-4 bg-green-50 border border-green-300 rounded-xl p-3">
                <p className="font-bold text-green-700">Sudah Dibayar</p>
                <p className="text-sm text-green-800">
                  Metode: {order.payment.paymentMethod.toUpperCase()}
                </p>
                <p className="font-semibold">Total: {formatRp(order.payment.amount)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </CustomerOrderLayout>
  )
}
