// resources/js/pages/customer/IndexPage.tsx
import { router } from '@inertiajs/react'
import CustomerOrderLayout from '~/layout/CostumersOrderLayout'
import { useState } from 'react'
import MenuCategoriesTopLayout from '~/layout/MenuCategorisTop'

export default function IndexPage({ menuItems, sessionToken, category }: any) {
  const [showNewBillConfirm, setShowNewBillConfirm] = useState(false)

  const handleAddItem = (menuItemId: any) => {
    // Jika tidak ada order aktif → berarti order pertama sudah pai

    // Kalau masih ada order berjalan → langsung tambah item
    router.post(`/order/session/${sessionToken}/add-item`, {
      menuItemId,
      qty: 1,
    })
  }

  const createNewBill = () => {
    setShowNewBillConfirm(false)

    // Panggil route untuk buat bill baru
    router.post(`/order/session/${sessionToken}/create-new-bill`, {})
  }
  return (
    <CustomerOrderLayout sessionToken={sessionToken}>
      <MenuCategoriesTopLayout sidebarItems={category} baseUrl={`/order/session/${sessionToken}`}>
        <h1 className="text-3xl font-bold text-orange-600 mb-4">🍽 Pilih Makanan</h1>

        {/* Modal Konfirmasi Buat Bill Baru */}
        {showNewBillConfirm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-semibold mb-3 text-center">Buat Bill Baru?</h3>

              <p className="text-gray-600 text-center mb-4">
                Bill sebelumnya sudah lunas. Apakah kamu ingin membuat bill baru?
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-300 py-2 rounded"
                  onClick={() => setShowNewBillConfirm(false)}
                >
                  Batal
                </button>

                <button
                  className="flex-1 bg-orange-500 text-white py-2 rounded"
                  onClick={createNewBill}
                >
                  Buat Baru
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daftar Menu */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuItems.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-lg p-2 cursor-pointer hover:shadow-lg flex flex-col"
            >
              <img src={item.imageUrl} className="w-full h-32 object-cover rounded" />
              <h3 className="mt-2 font-medium">{item.name}</h3>
              <p className="text-gray-600">Rp{item.price}</p>

              <button
                onClick={() => handleAddItem(item.id)}
                className="mt-2 bg-blue-500 text-white rounded py-1 hover:bg-blue-600"
              >
                Tambah
              </button>
            </div>
          ))}
        </div>
      </MenuCategoriesTopLayout>
    </CustomerOrderLayout>
  )
}
