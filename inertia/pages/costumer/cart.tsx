import { router } from '@inertiajs/react'
import CustomerOrderLayout from '~/layout/CostumersOrderLayout'

export default function CartPage({ order, cartItems, sessionToken }: any) {
  const updateQty = (id: any, qty: any) => {
    if (qty <= 0) return
    router.post(`/order/session/${sessionToken}/update-qty`, { itemId: id, qty })
  }

  const deleteItem = (id: any) => {
    router.post(`/order/session/${sessionToken}/delete-item`, { itemId: id })
  }

  const placeOrder = () => {
    router.post(`/order/${order.id}/place-order`)
  }

  return (
    <CustomerOrderLayout>
      <h1 className="text-3xl font-bold text-orange-600 mb-4">🧺 Keranjang</h1>

      {cartItems.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">Keranjang masih kosong 😢</p>
      )}

      <div className="space-y-4">
        {cartItems.map((i: any) => (
          <div key={i.id} className="bg-white shadow p-4 rounded-2xl flex gap-4 items-center">
            <img
              src={i.menuItem.image ?? 'https://source.unsplash.com/300x200/?food'}
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="font-bold text-lg">{i.menuItem.name}</h3>
              <p className="text-orange-500 font-semibold">Rp {i.price.toLocaleString()}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQty(i.id, i.quantity - 1)}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-bold">{i.quantity}</span>
                <button
                  onClick={() => updateQty(i.id, i.quantity + 1)}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>

                <button
                  onClick={() => deleteItem(i.id)}
                  className="ml-4 text-red-500 font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <button
          onClick={placeOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-lg font-bold shadow"
        >
          Pesan Sekarang 🚀
        </button>
      )}
    </CustomerOrderLayout>
  )
}
