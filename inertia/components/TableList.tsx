import { router } from '@inertiajs/react'
import React from 'react'
import { Table } from '~/pages/table'

interface TableListProps {
  tables: Table[]
}

const TableList: React.FC<TableListProps> = ({ tables }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nomor Meja
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kapasitas
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {tables?.map((table) => (
            <tr key={table.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {table.id}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {table.tableNumber}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {table.capacity} orang
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  onClick={() => router.get(`/table/update/${table.id}`)}
                  className="text-gray-400 hover:text-gray-700 mx-1"
                  aria-label="Edit"
                >
                  ✏️
                </button>

                <button
                  onClick={() => router.delete(`/table/delete/${table.id}`)}
                  className="text-gray-400 hover:text-red-600 mx-1"
                  aria-label="Hapus"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableList


