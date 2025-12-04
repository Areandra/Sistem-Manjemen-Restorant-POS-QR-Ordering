import CustomerOrderLayout from '~/layout/CostumersOrderLayout'

const COLOR_ACCENT = '#F39C12'
const COLOR_COOKING = '#E74C3C'
const COLOR_SERVED = '#27AE60'
const COLOR_DEFAULT = '#3498DB'

export default function ActiveOrderPage({ data }: any) {
  const session = data
  const orders = data.orders || []

  const formatRp = (v: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)

  return (
    <CustomerOrderLayout sessionToken={session.sessionToken}>
      <div className="max-w-xl mx-auto px-4 pb-20">
        <h1 className="p-6 text-2xl font-bold text-gray-800 border-b mb-4">Pesanan Aktif</h1>

        <div className="bg-white border border-gray-200 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Meja: {session.table.tableNumber}</h2>
          <p className="text-gray-600 text-sm mt-1">
            Session: <span className="font-mono">{session.sessionToken}</span>
          </p>
        </div>

        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">Belum ada pesanan.</p>
        )}

        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">Order #{order.orderCode}</h2>

                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
                  style={{
                    backgroundColor:
                      order.status === 'cooking'
                        ? COLOR_COOKING
                        : order.status === 'served'
                          ? COLOR_SERVED
                          : order.status === 'pending'
                            ? '#7f8c8d'
                            : COLOR_DEFAULT,
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p>Subtotal: {formatRp(order.subtotal)}</p>
                <p>Pajak: {formatRp(order.tax)}</p>
                <p className="font-bold text-lg" style={{ color: COLOR_ACCENT }}>
                  Total: {formatRp(order.total)}
                </p>
              </div>

              <div className="space-y-3">
                {order.items.map((i: any) => (
                  <div
                    key={i.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex gap-4"
                  >
                    <img
                      src={i.menuItem.imageUrl ?? 'https://source.unsplash.com/300x200/?meal'}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-base">{i.menuItem.name}</h3>

                      <p className="text-sm text-gray-600">
                        Qty: <span className="font-semibold">{i.quantity}</span>
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        Status:{' '}
                        <span
                          className="font-bold capitalize"
                          style={{
                            color:
                              i.status === 'cooking'
                                ? COLOR_COOKING
                                : i.status === 'ready' || i.status === 'delivered'
                                  ? COLOR_SERVED
                                  : '#7f8c8d',
                          }}
                        >
                          {i.status}
                        </span>
                      </p>
                    </div>

                    <div className="text-right font-bold text-sm" style={{ color: COLOR_ACCENT }}>
                      {formatRp(i.price)}
                    </div>
                  </div>
                ))}
              </div>

              {order.payment && (
                <div className="mt-4 bg-green-50 border border-green-300 rounded-lg p-3">
                  <p className="font-bold" style={{ color: COLOR_SERVED }}>
                    Sudah Dibayar
                  </p>

                  <p className="text-sm text-gray-700">
                    Metode: {order.payment.paymentMethod.toUpperCase()}
                  </p>

                  <p className="font-bold text-lg mt-1" style={{ color: COLOR_SERVED }}>
                    Total: {formatRp(order.payment.amount)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </CustomerOrderLayout>
  )
}
