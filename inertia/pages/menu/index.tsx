import { Head, Link } from '@inertiajs/react'
import MenuItemList from '~/components/MenuList'
import AdminLayout from '~/layout/AdminLayout'
import MenuCategories from '~/layout/MenuCategories'

// Definisi Tipe Data MenuItem (Berdasarkan Model Lucid AdonisJS Anda)
// Mengubah properti DateTime menjadi string/DateTime yang fleksibel untuk data Inertia
export interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: number
  costOfGoods: number | null
  imageUrl: string | null
  isAvailable: boolean
  sku: string | null
}

// Definisi Tipe Data untuk Data yang Dipaginasi

// Prop untuk Halaman Index
interface MenuItemsIndexProps {
  category: any // Sidebar categories
  data: MenuItem[] // Menggunakan tipe data MenuItems
}

const MenuItemsIndex = ({ category = [], data = [] }: MenuItemsIndexProps) => {
  return (
    <AdminLayout overflow={'hidden'}>
      <Head title="Item Menu" />
      <MenuCategories sidebarItems={category}>
        {/* Konten Halaman */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manajemen Item Menu</h2>

            <Link
              href="/menu/create" // Sesuaikan URL
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <span className="mr-2">+</span> Item Menu Baru
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari Item Menu berdasarkan nama atau SKU..."
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Komponen Daftar Item Menu */}
          <MenuItemList menuItems={data} />
        </div>
      </MenuCategories>
    </AdminLayout>
  )
}

export default MenuItemsIndex
