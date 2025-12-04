import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'
import MenuCategories from '~/layout/MenuCategories'

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

interface MenuItemsIndexProps {
  category: any
  data: MenuItem[]
}

const MenuItemsIndex = ({ category = [], data = [] }: MenuItemsIndexProps) => {
  const toggleAvailability = (itemId: number, currentStatus: boolean) => {
    router.post(`/menu/${itemId}/toggle-availability`, { status: !currentStatus })
  }

  return (
    <AdminLayout overflow={'hidden'}>
      <Head title="Item Menu" />
      <MenuCategories sidebarItems={category}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Manajemen Item Menu</h2>

            <button
              onClick={() => router.get('/menu/create')}
              className="bg-[#F39C12] hover:bg-[#d68910] text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <span className="mr-2">+</span> Item Menu Baru
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari Item Menu berdasarkan nama atau SKU..."
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-[#F39C12] focus:border-[#F39C12]"
            />
          </div>

          <div className="h-[77.5vh] space-y-4 overflow-y-auto">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl ?? 'https://source.unsplash.com/80x80/?food'}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.sku}</p>
                    <p className="text-gray-700 text-sm mt-1">Rp {item.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailability(item.id, item.isAvailable)}
                    className={`py-1 px-3 rounded-md text-white font-semibold text-sm transition-colors duration-150 ${
                      item.isAvailable
                        ? `bg-[#E74C3C] hover:bg-[#c0392b]`
                        : `bg-[#27AE60] hover:bg-[#219754]`
                    }`}
                  >
                    {item.isAvailable ? 'Set Not Available' : 'Set Available'}
                  </button>

                  <Link
                    href={`/menu/update/${item.id}`}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MenuCategories>
    </AdminLayout>
  )
}

export default MenuItemsIndex
