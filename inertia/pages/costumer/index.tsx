// resources/js/pages/customer/IndexPage.tsx
import React from 'react'
import { router } from '@inertiajs/react'
import CustomerOrderLayout from '~/layout/CostumersOrderLayout'

export default function IndexPage({ menuItems, sessionToken }: any) {
  const addItem = (id: any) => {
    router.post(`/order/session/${sessionToken}/add-item`, {
      menuItemId: id,
      qty: 1,
    })
  }

  return (
    <CustomerOrderLayout>
      <h1 className="text-3xl font-bold text-orange-600 mb-4">🍽 Pilih Makanan</h1>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((m: any) => (
          <div key={m.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-3">
            <img
              src={m.image ?? 'https://source.unsplash.com/300x200/?food'}
              className="rounded-xl h-32 w-full object-cover"
            />

            <div className="mt-3">
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-orange-500 font-semibold text-md mt-1">
                Rp {m.price.toLocaleString()}
              </p>

              <button
                onClick={() => addItem(m.id)}
                className="mt-3 w-full bg-orange-500 hover:bg-orange-600 transition text-white py-2 rounded-xl font-semibold"
              >
                Tambah 🍳
              </button>
            </div>
          </div>
        ))}
      </div>
    </CustomerOrderLayout>
  )
}
