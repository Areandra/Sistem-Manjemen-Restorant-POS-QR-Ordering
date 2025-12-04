import { PropsWithChildren } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { MoreHorizontal } from 'lucide-react'

export interface SidebarItem {
  id: number
  name: string
  sortOrder: number
}

interface LayoutProps extends PropsWithChildren {
  sidebarItems: SidebarItem[]
  baseUrl?: string
}

export default function MenuCategoriesTopLayout({
  children,
  sidebarItems,
  baseUrl = '/menu',
}: LayoutProps) {
  const currentUrl = usePage().url
  const items = [{ id: -1, name: 'All', sortOrder: -1 }, ...sidebarItems]

  const getCategoryUrl = (item: SidebarItem) =>
    item.id === -1 ? baseUrl : `${baseUrl}/categories/${item.id}`

  const isActive = (item: SidebarItem) => {
    if (item.id === -1) return currentUrl === baseUrl
    return currentUrl.startsWith(`${baseUrl}/categories/${item.id}`)
  }

  return (
    <div className="space-y-6 bg-gray-50 flex flex-col min-h-screen">
      <div className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg text-gray-900">Kategori</span>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent pb-2">
          {items
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <div key={item.id} className="flex items-center relative">
                <Link
                  href={getCategoryUrl(item)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded flex items-center font-bold text-s transition-colors duration-150 ${
                      isActive(item)
                        ? 'bg-[#E74C3C] text-white border-[#F39C12] shadow-md'
                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-[#FDE8C2]'
                    }
                  `}
                >
                  {item.name}
                </Link>

                {item.id !== -1 && baseUrl === '/menu' && (
                  <div className="ml-2 relative">
                    <button className="p-1 hover:bg-gray-200">
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
