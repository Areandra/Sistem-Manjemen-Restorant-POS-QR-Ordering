import { Head, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import CashierLayout from '~/layout/CashierLayout'
import MenuCategoriesLayout from '~/layout/MenuCategories'
import { nextOrderItemStatus, nextKotStatus } from '~/utils/status'

interface MenuItem {
  id: number
  name: string
}

interface KotOrderItem {
  id: number
  quantity?: number
  notes?: string | null
  status: 'cart' | 'ordered' | 'cooking' | 'ready' | 'delivered'
  menuItem?: MenuItem | null
}

interface Table {
  tableNumber: string
}

interface OrderData {
  id: number
  notes: string | null
  createdAt: string
  table?: Table | null
  status: any
}

interface KotPayload {
  id: number
  status: 'sent' | 'viewed' | 'processing' | 'done'
  createdAt: string
  orderItem: KotOrderItem
  order: OrderData
}

interface KotBoardProps {
  kots: KotPayload[]
  category: any
}

export default function KotBoard({ kots, category }: KotBoardProps) {
  const [viewMode, setViewMode] = useState<'active' | 'completed'>('active')
  const [groupMode, setGroupMode] = useState<'flat' | 'table'>('flat')

  const filteredKots = kots.filter((k) =>
    viewMode === 'active' ? k.status !== 'done' : k.status === 'done'
  )

  const groupByOrder = useMemo(() => {
    const map = new Map<number, KotPayload[]>()

    filteredKots.forEach((k) => {
      const orderId = k.order.id
      if (!map.has(orderId)) map.set(orderId, [])
      map.get(orderId)!.push(k)
    })

    return map
  }, [filteredKots])

  const updateItemStatus = async (id: number, current: string) => {
    const newStatus = nextOrderItemStatus(current)

    console.log(`Updating OrderItem ${id}: ${current} → ${newStatus}`)

    await fetch(`/kitchen/order-item/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    router.reload()
  }

  const updateKotStatus = async (id: number, current: string) => {
    const newStatus = nextKotStatus(current)

    console.log(`Updating KOT ${id}: ${current} → ${newStatus}`)

    await fetch(`/kitchen/kot/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.reload()
  }

  const getFloor = (tn?: string) => (tn?.includes('A') ? 'First Floor' : 'Ground Floor')

  const RenderKotCard = (kot: KotPayload) => {
    if (!kot?.orderItem) return <></>
    return (
      <div
        key={kot.id}
        className="min-w-[280px] w-[280px] bg-white border border-gray-200 rounded-xl p-4 shadow-md flex flex-col"
      >
        <div className="flex justify-between text-sm mb-1 items-start">
          <span className="font-bold text-[#5B4636]">KOT #{kot.id}</span>

          <span className="text-gray-500 text-xs">
            {new Date(kot.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3 font-medium">
          {getFloor(kot?.order?.table?.tableNumber)} • {kot?.order?.table?.tableNumber ?? 'N/A'}
        </p>

        <div className="mb-4 pb-2 border-b border-dashed border-gray-200">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-800">{kot?.orderItem?.menuItem?.name}</p>
            <span className="text-xs font-semibold text-gray-700">{kot?.orderItem?.quantity}</span>
          </div>

          {kot?.orderItem?.notes &&
            kot?.orderItem?.notes.split('. ').map((n: string, x: number) => (
              <p key={x} className="text-xs ml-2 mt-1 text-gray-600">
                • {n}
              </p>
            ))}
        </div>

        <button
          onClick={() => updateItemStatus(kot.orderItem?.id, kot.orderItem?.status)}
          className="bg-[#E74C3C] text-white py-2 rounded-md text-xs font-bold mb-2 transition-colors duration-150 hover:bg-[#c0392b]"
        >
          Next Item: {nextOrderItemStatus(kot.orderItem?.status)}
        </button>

        <button
          onClick={() => updateKotStatus(kot.id, kot.status)}
          className="bg-[#F39C12] text-gray-800 py-2 rounded-md text-xs font-bold transition-colors duration-150 hover:bg-[#e67e22]"
        >
          Next KOT: {nextKotStatus(kot.status)}
        </button>
      </div>
    )
  }

  const links = [
    { label: 'Manajemen', href: '/menu' },
    { label: 'Kasir', href: '/cashier/order' },
  ]

  return (
    <CashierLayout headerLinks={links}>
      <MenuCategoriesLayout sidebarItems={category} baseUrl="/kitchen/kot">
        <Head title="Kitchen" />
        <div className="w-full p-4 min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-[#5B4636]">KOT</h1>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('active')}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                  viewMode === 'active'
                    ? 'bg-[#F7DC6F] text-[#A0522D] font-bold' // Warna Aktif: Krem ke Coklat
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                Active
              </button>

              <button
                onClick={() => setViewMode('completed')}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                  viewMode === 'completed'
                    ? 'bg-[#F7DC6F] text-[#A0522D] font-bold' // Warna Aktif: Krem ke Coklat
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                Completed
              </button>

              <button
                onClick={() => setGroupMode(groupMode === 'flat' ? 'table' : 'flat')}
                className="px-3 py-1 rounded-md bg-[#A0522D] text-white text-sm transition-colors duration-150 hover:bg-[#8d4828]"
              >
                {groupMode === 'flat' ? 'Group by Table' : 'Flat Mode'}
              </button>
            </div>
          </div>

          <div className='flex justify-center'>
            <div className="grid grid-cols-1 md:grid-cols-2 l:grid-cols-2 xl:grid-cols-5 gap-8">
              {groupMode === 'flat' && filteredKots.map((k) => <RenderKotCard key={k.id} {...k} />)}

              {groupMode === 'table' &&
                Array.from(groupByOrder.entries()).map(([orderId, items]) => (
                  <div
                    key={orderId}
                    className="bg-white border rounded-xl p-4 shadow min-w-[320px]"
                  >
                    <h2 className="font-bold text-lg text-[#5B4636] mb-2">
                      Order #{orderId} • {items[0]?.order?.table?.tableNumber ?? 'N/A'} • Status:{' '}
                      {items[0]?.order?.status}
                    </h2>

                    <div className="space-y-3">
                      {items.map((k) => (
                        <RenderKotCard key={k.id} {...k} />
                      ))}
                    </div>
                  </div>
                ))}

              <div className="min-w-[40px]" />
            </div>
          </div>
        </div>
      </MenuCategoriesLayout>
    </CashierLayout>
  )
}
