import { Head, Link } from '@inertiajs/react'
import { DateTime } from 'luxon'
import AdminLayout from '~/layout/AdminLayout'
import TableList from '~/components/TableList'

export interface Table {
  id: number
  tableNumber: string
  capacity: number
  createdAt: DateTime
  updatedAt: DateTime
}

const TablesIndex = ({ tables }: any) => {
  return (
    <AdminLayout overflow={'hidden'}>
      <Head title="Manajemen Meja" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Meja</h2>

          <Link
            href="/table/create"
            className="bg-[#F39C12] hover:bg-[#d68910] text-white font-bold py-2 px-4 rounded flex items-center transition"
          >
            <span className="mr-2">+</span> Meja Baru
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari Meja berdasarkan nomor atau kapasitas..."
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-[#F39C12] focus:border-[#F39C12]"
          />
        </div>

        <div className="h-[77.5vh] overflow-y-auto">
          <TableList tables={tables.data} />
        </div>
      </div>
    </AdminLayout>
  )
}

export default TablesIndex
