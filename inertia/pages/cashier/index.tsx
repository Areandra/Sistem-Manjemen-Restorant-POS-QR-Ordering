import { Head, usePage } from '@inertiajs/react'
import CashierLayout from '~/layout/CashierLayout'
import MenuCategoriesLayout from '~/layout/MenuCategories'
import OrderDetailPanel from '~/components/OrderDetailPanel'
import ActiveOrderPanel from '~/components/ActiveOrderPanel'
import { useEffect, useState } from 'react'

export default function PosIndex({ category = [], data = [], orders = [] }: any) {
  const currentUrl = usePage().url

  const [selectedOrder, setSelectedOrder] = useState<any>({})
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!selectedOrderId) return

    const fetchData = async () => {
      const res = await fetch(`${currentUrl}/${selectedOrderId}`, {
        method: 'GET',
      })
      const order = await res.json()
      console.log('order', order)

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
      alert('Gagal del-item')
    }
  }

  const links = [
    { label: 'Manajemen', href: '/menu' },
    { label: 'Kitchen', href: '/kitchen/kot' },
  ]

  return (
    <CashierLayout headerLinks={links}>
      <MenuCategoriesLayout sidebarItems={category} baseUrl="/cashier/order">
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
          <Head title="Kasir - POS" />
          <div className="flex-1 p-4 overflow-x-hidden">
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {data
                .filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase()))
                .map((item: any) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-2 cursor-pointer hover:shadow-lg flex flex-col"
                  >
                    <img src={item.imageUrl} className="w-full h-32 object-cover rounded" />
                    <h3 className="mt-2 font-medium">{item.name}</h3>
                    <p className="text-gray-600">Rp{item.price}</p>
                    <button
                      onClick={() => addMenuItem(item.id)}
                      className="mt-2 bg-blue-500 text-white rounded py-1 hover:bg-blue-600"
                    >
                      Tambah
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </ActiveOrderPanel>
      </MenuCategoriesLayout>
    </CashierLayout>
  )
}
