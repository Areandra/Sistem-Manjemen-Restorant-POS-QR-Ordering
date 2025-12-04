import { Head, router } from '@inertiajs/react'
import CashierLayout from '~/layout/CashierLayout'

export interface Table {
  id: number
  tableNumber: string
  capacity: number
  session?: any
}

const links = [
  { label: 'Manajemen', href: '/menu' },
  { label: 'Kitchen', href: '/kitchen/kot' },
  { label: 'Cashier', href: '/cashier' },
]

const SelectTable = ({ data }: { data: Table[] }) => {
  const handleSelect = (tableId: number) => {
    console.log('tableid', tableId)

    router.post(`?table_id=${tableId}`)
  }

  const handleEndSession = (sessionToken: number) => {
    router.post(`/cashier/session/${sessionToken}/end`)
  }

  console.log(data)

  return (
    <CashierLayout headerLinks={links}>
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

                {/* Session Status */}
                {table.session.length !== 0 ? (
                  <p className="mt-2 text-red-600 text-sm font-semibold">
                    ● Session Aktif (ID: {table?.session[0].sessionToken})
                  </p>
                ) : (
                  <p className="mt-2 text-green-600 text-sm font-semibold">● Tidak ada session</p>
                )}
              </div>

              {/* Buttons */}
              {table.session.length !== 0 ? (
                <>
                  <button
                    onClick={() => handleEndSession(table?.session![0]!.sessionToken)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-150"
                  >
                    Kill Session
                  </button>
                  <button
                    onClick={() => handleSelect(table?.id)}
                    className="mt-4 bg-[#E74C3C] hover:bg-[#F39C12] text-white font-bold py-2 px-4 rounded-md transition-colors duration-150"
                  >
                    New Bill
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleSelect(table?.id)}
                  className="mt-4 bg-[#E74C3C] hover:bg-[#F39C12] text-white font-bold py-2 px-4 rounded-md transition-colors duration-150"
                >
                  Pilih Meja
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </CashierLayout>
  )
}

export default SelectTable
