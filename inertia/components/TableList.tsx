import { router } from '@inertiajs/react'
import React from 'react'
import { Table } from '~/pages/table'

interface TableListProps {
  tables: Table[]
}

const COLOR_AVAILABLE = '#27AE60'
const COLOR_UNAVAILABLE = '#E74C3C'

const TableList: React.FC<TableListProps> = ({ tables }) => {
  return (
    <div className="space-y-4">
      {tables?.map((table) => (
        <div
          key={table.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Meja {table.tableNumber}</h3>
            <p className="text-sm text-gray-600">Kapasitas: {table.capacity} orang</p>
            <span
              className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{
                backgroundColor: table.capacity > 0 ? COLOR_AVAILABLE : COLOR_UNAVAILABLE,
              }}
            >
              {table.capacity > 0 ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.get(`/table/update/${table.id}`)}
              className="px-3 py-1 rounded-md bg-[#F39C12] text-white text-sm font-semibold hover:bg-[#d68910] transition"
            >
              Edit
            </button>
            <button
              onClick={() => router.delete(`/table/delete/${table.id}`)}
              className="px-3 py-1 rounded-md bg-[#E74C3C] text-white text-sm font-semibold hover:bg-[#c0392b] transition"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TableList
