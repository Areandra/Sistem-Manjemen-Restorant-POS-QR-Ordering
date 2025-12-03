import { Link } from '@inertiajs/react'

// ActiveOrderPanel.tsx
export default function ActiveOrderPanel({
  orderDetail,
  orders,
  setSelectedOrderId,
  children,
}: any) {
  return (
    <div className="flex min-h-screen">
      {/* Kolom 1: Konten Utama (Grid Menu) - Mengisi ruang yang tersedia */}
      <main className="flex-grow min-w-0">{children}</main>

      {orderDetail}

      {/* Kolom 3: Daftar Order Aktif - Fixed width (w-80) dan menyusut */}
      <aside className="border-l bg-white shadow-lg flex flex-col p-4 flex-shrink-0">
        <h2 className="font-semibold mb-4 text-lg">Order Aktif</h2>

        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex w-full items-center">
            <Link
              href="/cashier/order/start"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex-1 text-center"
            >
              New Order
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada order aktif.</p>
          ) : (
            orders.map((order: any) => (
              <div
                key={order.id}
                className="p-3 bg-gray-50 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedOrderId(order.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Meja {order.table.tableNumber}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded capitalize">
                    {order.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-medium">{order.orderCode}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
