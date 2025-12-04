import { router } from '@inertiajs/react'
import CustomerOrderLayout from '~/layout/CostumersOrderLayout'
import { Trash2 } from 'lucide-react'

export default function CartPage({ data }: any) {
  const sessionToken = data.sessionToken
  const orderId = data.orders.length > 0 ? data.orders[0].id : null

  const cartItems = data.orders.flatMap((o: any) =>
    o.items.filter((item: any) => item.status === 'cart')
  )

  const updateQty = (id: any, qty: any) => {
    if (qty <= 0) return
    router.post(`/order/session/${sessionToken}/update-qty`, { itemId: id, qty })
  }

  const deleteItem = (id: any) => {
    router.post(`/order/session/${sessionToken}/delete-item`, { itemId: id })
  }

  const placeOrder = () => {
    if (!orderId) return
    router.post(`/order/session/${sessionToken}/place-order`)
  }

  const totalHarga = cartItems.reduce(
    (total: number, item: any) => total + parseInt(item.price) * item.quantity,
    0
  )

  return (
    <CustomerOrderLayout sessionToken={data.sessionToken}>
      <div className="max-w-xl mx-auto overflow-x-hidden">
        <h1 className="p-6 text-2xl font-bold text-gray-800 border-b mb-4">
          Keranjang Belanja Makanan
        </h1>

        {cartItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">Keranjang masih kosong 😢</p>
        )}

        <div className="space-y-4 px-4 pb-20">
          {cartItems.map((i: any) => (
            <div
              key={i.id}
              className="bg-white border border-gray-200 p-4 rounded-lg flex gap-4 relative"
            >
              <img
                src={i.menuItem.imageUrl ?? 'https://source.unsplash.com/300x200/?food'}
                className="w-20 h-20 rounded-md object-cover flex-shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-base text-gray-800 line-clamp-2">
                    {i.menuItem.name}
                  </h3>
                  <p className="text-sm font-normal text-gray-500">
                    Harga Satuan: Rp {parseInt(i.price).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQty(i.id, i.quantity - 1)}
                      className="w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-l-md transition-colors duration-150 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-8 text-center border-x border-gray-300 h-8 flex items-center justify-center">
                      {i.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(i.id, i.quantity + 1)}
                      className="w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-r-md transition-colors duration-150 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal Item menonjol di sebelah kanan */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#F39C12]">
                      Rp {(parseInt(i.price) * i.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteItem(i.id)}
                className="absolute top-2 right-2 text-[#E74C3C] hover:text-[#c0392b] transition-colors duration-150 p-1 rounded-full"
                title="Hapus Item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="fixed bottom-16 left-0 w-full bg-white border-t shadow-lg p-4 z-10">
            <div className="max-w-xl mx-auto flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  Total Harga ({cartItems.length} item):
                </span>
                <span className="text-xl font-extrabold text-[#27AE60]">
                  Rp {totalHarga.toLocaleString()}
                </span>
              </div>

              <button
                onClick={placeOrder}
                className="bg-[#27AE60] hover:bg-[#219754] text-white py-3 px-8 rounded-lg text-lg font-bold shadow-md transition-colors duration-150"
              >
                Pesan Sekarang 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomerOrderLayout>
  )
}
