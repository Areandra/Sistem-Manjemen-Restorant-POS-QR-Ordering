import { router } from '@inertiajs/react'
import CustomerOrderLayout from '~/layout/CostumersOrderLayout'
import { useState } from 'react'
import MenuCategoriesTopLayout from '~/layout/MenuCategorisTop'

const COLOR_DANGER = '#E74C3C'
const COLOR_GRAY = '#95A5A6'

export default function IndexPage({ menuItems, sessionToken, category }: any) {
  const [showNewBillConfirm, setShowNewBillConfirm] = useState(false)

  const handleAddItem = (menuItemId: any) => {
    router.post(`/order/session/${sessionToken}/add-item`, { menuItemId, qty: 1 })
  }

  const createNewBill = () => {
    setShowNewBillConfirm(false)
    router.post(`/order/session/${sessionToken}/create-new-bill`, {})
  }

  const groupedMenu = category
    .map((cat: any) => ({
      ...cat,
      items: menuItems.filter((m: any) => m.categoryId === cat.id),
    }))
    .filter((cat: any) => cat.items.length > 0)

  return (
    <CustomerOrderLayout sessionToken={sessionToken}>
      <MenuCategoriesTopLayout sidebarItems={category} baseUrl={`/order/session/${sessionToken}`}>
        <div className="max-w-xl mx-auto pb-20 space-y-6">
          {showNewBillConfirm && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                  Buat Bill Baru?
                </h3>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  Bill sebelumnya sudah lunas. Apakah kamu yakin ingin membuat bill baru?
                </p>
                <div className="flex gap-3">
                  <button
                    className={`flex-1 bg-[${COLOR_GRAY}] text-white py-2 rounded-md font-semibold transition-colors duration-150 hover:bg-gray-600`}
                    onClick={() => setShowNewBillConfirm(false)}
                  >
                    Batal
                  </button>
                  <button
                    className={`flex-1 bg-[${COLOR_DANGER}] text-white py-2 rounded-md font-semibold transition-colors duration-150 hover:bg-[#c0392b]`}
                    onClick={createNewBill}
                  >
                    Buat Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {groupedMenu.map((cat: any) => (
            <div key={cat.id}>
              <h2 className="text-lg font-bold mb-3 text-gray-800 border-b pb-1">{cat.name}</h2>

              <div className="space-y-4">
                {cat.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex gap-4 items-center w-full justify-between"
                  >
                    <img
                      src={item.imageUrl ?? 'https://source.unsplash.com/300x200/?meal'}
                      className="w-24 h-24 rounded-md object-cover flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base line-clamp-2">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-[#F39C12] font-bold text-sm">
                          Rp{parseInt(item.price).toLocaleString()}
                        </p>

                        <button
                          onClick={() => handleAddItem(item.id)}
                          className="bg-[#27AE60] text-white rounded-md py-1 px-3 text-sm font-semibold transition-colors duration-150 hover:bg-[#219754]"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MenuCategoriesTopLayout>
    </CustomerOrderLayout>
  )
}
