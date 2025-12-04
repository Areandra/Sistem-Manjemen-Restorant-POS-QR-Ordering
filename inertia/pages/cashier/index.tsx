import { Head, usePage } from '@inertiajs/react'
import CashierLayout from '~/layout/CashierLayout'
import OrderDetailPanel from '~/components/OrderDetailPanel'
import ActiveOrderPanel from '~/components/ActiveOrderPanel'
import { useEffect, useState } from 'react'
import MenuCategoriesLayout from '~/layout/MenuCategories'

export default function PosIndex({ category = [], data = [], orders = [] }: any) {
  const currentUrl = usePage().url

  const [selectedOrder, setSelectedOrder] = useState<any>({})
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0)
  const [search, setSearch] = useState('')

  const groupedMenu = category
    .map((cat: any) => ({
      ...cat,
      items: data.filter(
        (m: any) =>
          m.categoryId === cat.id &&
          (!search || m.name.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((cat: any) => cat.items.length > 0)

  useEffect(() => {
    if (!selectedOrderId) return

    const fetchData = async () => {
      const res = await fetch(`${currentUrl}/${selectedOrderId}`, {
        method: 'GET',
      })
      const order = await res.json()
      setSelectedOrder(order)
    }

    fetchData()
  }, [selectedOrderId])

  const addMenuItem = async (menu_item_id: number) => {
    if (!selectedOrderId) return alert('Pilih order dulu!')

    try {
      await fetch('/cashier/order/add-item', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          menu_item_id,
          qty: 1,
        }),
      })

      const orderRes = await fetch(`/cashier/order/${selectedOrderId}`)
      const fullOrder = await orderRes.json()
      setSelectedOrder(fullOrder)
    } catch (err) {
      console.error(err)
      alert('Gagal menambahkan item')
    }
  }

  const updateItemQty = async (item_id: number, qty: number) => {
    try {
      await fetch('/cashier/order/update-qty', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id, qty }),
      })
      const orderRes = await fetch(`/cashier/order/${selectedOrderId}`)
      const fullOrder = await orderRes.json()
      setSelectedOrder(fullOrder)
    } catch (err) {
      console.error(err)
      alert('Gagal update qty')
    }
  }

  const delItem = async (item_id: number) => {
    try {
      await fetch('/cashier/order/delete-item', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id }),
      })
      const orderRes = await fetch(`/cashier/order/${selectedOrderId}`)
      const fullOrder = await orderRes.json()
      setSelectedOrder(fullOrder)
    } catch (err) {
      console.error(err)
      alert('Gagal del-item')
    }
  }

  const orderAll = async (order_id: number) => {
    try {
      await fetch(`/cashier/order/place-order/${order_id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const orderRes = await fetch(`/cashier/order/${selectedOrderId}`)
      const fullOrder = await orderRes.json()
      setSelectedOrder(fullOrder)
    } catch (err) {
      console.error(err)
      alert('Gagal place order')
    }
  }

  const links = [
    { label: 'Manajemen', href: '/menu' },
    { label: 'Kitchen', href: '/kitchen/kot' },
  ]

  return (
    <CashierLayout headerLinks={links}>
      <ActiveOrderPanel
        setSelectedOrderId={setSelectedOrderId}
        orders={orders}
        orderDetail={
          selectedOrderId ? (
            <OrderDetailPanel
              order={selectedOrder}
              updateItemQty={updateItemQty}
              delItem={delItem}
              orderAll={orderAll}
            />
          ) : null
        }
      >
        <MenuCategoriesLayout
          sidebarItems={groupedMenu.map((c: any) => ({
            id: c.id,
            name: c.name,
            sortOrder: c.sortOrder,
          }))}
          baseUrl="/cashier/order"
        >
          <Head title="Kasir - POS" />

          <div className="flex h-[95vh] p-4 overflow-hidden flex flex-col">
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full p-2 border rounded-md mb-4"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Container scrollable */}
            <div className="flex-1 overflow-y-auto">
              {groupedMenu.map((cat: any) => (
                <div key={cat.id} className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1">{cat.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cat.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-2 cursor-pointer hover:shadow-lg flex flex-col transition duration-150 bg-white"
                      >
                        <img
                          src={item.imageUrl ?? 'https://source.unsplash.com/300x200/?meal'}
                          className="w-full h-32 object-cover rounded"
                        />
                        <h3 className="mt-2 font-medium">{item.name}</h3>
                        <p className="text-gray-600">Rp{item.price.toLocaleString()}</p>
                        <button
                          onClick={() => addMenuItem(item.id)}
                          className="mt-2 bg-[#E74C3C] text-white rounded-md py-1 font-semibold transition-colors duration-150 hover:bg-[#F39C12] hover:text-gray-800"
                        >
                          Tambah
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MenuCategoriesLayout>
      </ActiveOrderPanel>
    </CashierLayout>
  )
}
