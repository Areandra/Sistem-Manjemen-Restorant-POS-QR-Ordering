import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { CalendarCheck, User, Table, Menu, ChevronRight, ChevronLeft } from 'lucide-react'

interface SidebarItem {
  name: string
  icon: React.ElementType
  href: string
  active: boolean
}

export default function AdminLayout({ children, overflow }: any) {
  const currentUrl = usePage().url
  const [hide, setHide] = useState(true)

  const mainMenuItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      icon: CalendarCheck,
      href: '/dashboard',
      active: currentUrl.includes('/dashboard'),
    },
    {
      name: 'Users',
      icon: User,
      href: '/users',
      active: currentUrl.includes('/users'),
    },
    {
      name: 'Menu',
      icon: Menu,
      href: '/menu',
      active: currentUrl.includes('/menu'),
    },
    {
      name: 'Table',
      icon: Table,
      href: '/table',
      active: currentUrl.includes('/table'),
    },
  ]

  return (
    <div className="relative min-h-screen bg-gray-50 h-screen">
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 px-6 z-40 flex items-center justify-between">
        <div className="flex items-center h-16">
          <div className="w-8 h-8 bg-[#E74C3C] rounded-lg mr-4"></div>
          <span className="ml-10 mr-4 font-bold text-lg text-gray-800">Manajemen Restoran</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/cashier/order"
            className="bg-[#E74C3C] hover:bg-[#F39C12] text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-150"
          >
            Cashier
          </Link>
          <Link
            href="/kitchen/kot"
            className="bg-[#E74C3C] hover:bg-[#F39C12] text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-150"
          >
            Kitchen
          </Link>
        </div>
      </header>

      <div className="flex pt-16 h-full">
        <aside
          className={`bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto transition-all duration-300 ${
            hide ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-4 flex items-center justify-between h-8 border-b border-gray-200">
            {!hide && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                MAIN NAVIGATION
              </h3>
            )}
            <button
              onClick={() => setHide(!hide)}
              className="flex items-center p-3 text-gray-500 hover:text-[#E74C3C] transition-colors duration-150"
            >
              {hide ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {mainMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-lg text-base transition duration-150 ${
                  item.active
                    ? 'bg-[#F7DC6F] text-[#E74C3C] font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!hide && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className={`flex-1 overflow-${overflow}`}>{children}</main>
      </div>
    </div>
  )
}
