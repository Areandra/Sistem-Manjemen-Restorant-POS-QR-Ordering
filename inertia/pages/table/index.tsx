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
    <AdminLayout>
      <Head title="Meja" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Manajemen Meja</h2>

          <Link
            href="/table/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <span className="mr-2">+</span> Meja Baru
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari Meja berdasarkan nomor atau kapasitas..."
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <TableList tables={tables.data} />
      </div>
    </AdminLayout>
  )
}

export default TablesIndex
