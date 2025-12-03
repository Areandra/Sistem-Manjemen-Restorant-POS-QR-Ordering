// File: ~/components/MenuItemList.tsx
import { router } from '@inertiajs/react'
import React from 'react'
import { MenuItem } from '~/pages/menu/index' // Mengimpor tipe MenuItem

interface MenuItemListProps {
  menuItems: MenuItem[]
}

// **CATATAN:** Saya menghilangkan duplikasi .map() yang tidak disengaja di kode Anda.

const MenuItemList: React.FC<MenuItemListProps> = ({ menuItems = [] }) => {
  return (
    // Berikan tinggi tetap yang jelas pada container, misal max-h-screen atau h-[600px]
    // dan gunakan overflow-hidden agar scroll hanya terjadi di body tabel
    <div className="bg-white h-full max-h-[78.8vh] rounded-xl shadow-lg flex flex-col">
      <div className="flex-shrink-0">
        {' '}
        {/* Header tabel tidak ikut di-scroll */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ketersediaan
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  Rp{item.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => router.get(`/menu/update/${item.id}`)}
                    className="text-gray-400 hover:text-gray-700 mx-1"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => router.delete(`/menu/delete/${item.id}`)}
                    className="text-gray-400 hover:text-red-600 mx-1"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {/* Tambahkan kondisi untuk saat data kosong */}
            {menuItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data menu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MenuItemList
