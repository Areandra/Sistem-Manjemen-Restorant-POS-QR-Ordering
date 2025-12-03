import CustomerOrderLayout from '~/layout/CostumersOrderLayout'

export default function ActiveOrderPage({ orderedItems }: any) {
  return (
    <CustomerOrderLayout>
      <h1 className="text-3xl font-bold text-orange-600 mb-4">🍱 Pesanan Saya</h1>

      {orderedItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">Belum ada pesanan dibuat.</p>
      ) : (
        <div className="space-y-4">
          {orderedItems.map((i: any) => (
            <div key={i.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
              <img
                src={i.menuItem.image ?? 'https://source.unsplash.com/300x200/?meal'}
                className="w-20 h-20 rounded-xl object-cover"
              />

              <div>
                <h3 className="font-bold text-lg">{i.menuItem.name}</h3>
                <p>Qty: {i.quantity}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className="font-bold capitalize text-green-600">{i.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerOrderLayout>
  )
}
