import { PropsWithChildren } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ArrowUp, ArrowDown, Delete, Edit } from 'lucide-react'

export interface SidebarItem {
  id: number
  name: string
  sortOrder: number
}

interface LayoutProps extends PropsWithChildren {
  sidebarItems: SidebarItem[]
  baseUrl?: string
}

export default function MenuCategoriesLayout({
  children,
  sidebarItems,
  baseUrl = '/menu',
}: LayoutProps) {
  const currentUrl = usePage().url
  const items = [{ id: -1, name: 'All', sortOrder: -1 }, ...sidebarItems]

  const getCategoryUrl = (item: SidebarItem) =>
    item.id === -1 ? baseUrl : `${baseUrl}/categories/${item.id}`

  const getCategoryActionUrl = (
    item: SidebarItem,
    action: 'move-up' | 'move-down' | 'update' | 'delete'
  ) => `${baseUrl}/categories/${item.id}/${action}`

  const isActive = (item: SidebarItem) => {
    if (item.id === -1) return currentUrl === baseUrl
    return currentUrl.startsWith(`${baseUrl}/categories/${item.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-80 bg-white flex-shrink-0 h-screen flex flex-col">
        <div className="p-4 flex items-center h-16 border-b border-gray-300 justify-between">
          <span className="font-bold text-lg text-black-300">Categories</span>
          {baseUrl === '/menu' && (
            <Link
              href={`${baseUrl}/categories/create`}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              +
            </Link>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {items
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <div
                key={item.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg text-base transition duration-150
                  ${isActive(item) ? 'bg-red-50 text-red-600 font-semibold shadow-sm' : 'text-black-400 hover:bg-gray-900 hover:text-white'}
                `}
              >
                <Link href={getCategoryUrl(item)} className="flex items-center flex-1">
                  {item.name}
                </Link>

                {item.id !== -1 && baseUrl === '/menu' && (
                  <div className="flex gap-1 ml-4">
                    <Link
                      href={getCategoryActionUrl(item, 'move-up')}
                      method="post"
                      as="button"
                      className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <ArrowUp className="w-4 h-4 text-gray-200" />
                    </Link>

                    <Link
                      href={getCategoryActionUrl(item, 'move-down')}
                      method="post"
                      as="button"
                      className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <ArrowDown className="w-4 h-4 text-gray-200" />
                    </Link>

                    <Link
                      href={getCategoryActionUrl(item, 'update')}
                      method="get"
                      as="button"
                      className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <Edit className="w-4 h-4 text-gray-200" />
                    </Link>

                    <Link
                      href={getCategoryActionUrl(item, 'delete')}
                      method="delete"
                      as="button"
                      className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <Delete className="w-4 h-4 text-gray-200" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  )
}
