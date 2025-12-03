import { Head, router } from '@inertiajs/react'
import CashierLayout from '~/layout/CashierLayout'

export interface Table {
  id: number
  tableNumber: string
  capacity: number
  isAvailable?: boolean
}

const SelectTable = ({ data }: { data: Table[] }) => {
  const handleSelect = (tableId: number) => {
    router.post(`?table_id=${tableId}`)
  }

  return (
    <CashierLayout>
      <Head title="Pilih Meja" />

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Pilih Meja untuk Membuat Pesanan Baru
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((table) => (
            <div
              key={table.id}
              className="border rounded-lg p-4 shadow-sm flex flex-col justify-between bg-white"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-700">Meja {table.tableNumber}</h3>
                <p className="text-gray-500 text-sm">Kapasitas: {table.capacity} orang</p>
              </div>

              <button
                onClick={() => handleSelect(table.id)}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                Pilih Meja
              </button>
            </div>
          ))}
        </div>
      </div>
    </CashierLayout>
  )
}

export default SelectTable
