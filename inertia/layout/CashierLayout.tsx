import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { CalendarCheck, User, Table, Menu, Lock, ChevronRight, ChevronLeft } from 'lucide-react'

interface SidebarItem {
  name: string
  icon: React.ElementType
  href: string
  active: boolean
}

export default function CashierLayout({ children }: PropsWithChildren) {
  // const currentUrl = usePage().url
  const [hide, setHide] = useState(true)

  // const mainMenuItems: SidebarItem[] = [
  //   {
  //     name: 'Dashboard',
  //     icon: CalendarCheck,
  //     href: '/dashboard',
  //     active: currentUrl.includes('/dashboard'),
  //   },
  //   {
  //     name: 'Users',
  //     icon: User,
  //     href: '/users',
  //     active: currentUrl.includes('/bookings'),
  //   },
  //   {
  //     name: 'Roles and Permission',
  //     icon: Lock,
  //     href: '/roles',
  //     active: currentUrl.includes('/roles') || currentUrl.includes('/permission'),
  //   },
  //   {
  //     name: 'Menu',
  //     icon: Menu,
  //     href: '/menu',
  //     active: currentUrl.includes('/menu'),
  //   },
  //   {
  //     name: 'Table',
  //     icon: Table,
  //     href: '/table',
  //     active: currentUrl.includes('/table'),
  //   },
  // ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* <aside className="bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 flex items-center justify-between mt-16 items-center h-8 border-b border-gray-200">
          {!hide && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              MAIN NAVIGATION
            </h3>
          )}
          <button className="flex items-center p-3" onClick={() => setHide(!hide)}>
            {!hide ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {mainMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-base transition duration-150 ${
                item.active
                  ? 'bg-red-50 text-red-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!hide && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside> */}

      <main className="flex-1 relative">
        <header className="fixed top-0 w-full right-0 h-16 bg-white border-b border-gray-200 px-6 z-40 flex items-center justify-between">
          <div className="p-4 pl-0 flex justify-between items-center h-16">
            <div className="relative justify-between w-8 h-full bg-red-600 rounded-lg"></div>
            <span className="ml-10 mr-4 font-bold text-lg text-white-400">Manajemen Restorant</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/menu" // Sesuaikan URL
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              Manajemen{' '}
            </Link>
            <Link
              href="/kitchen/kot" // Sesuaikan URL
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              Kitchen{' '}
            </Link>
            <span className="text-sm font-medium text-gray-700">Hi, Admin</span>
            <User className="w-6 h-6 text-gray-600 border p-1 rounded-full" />
          </div>
        </header>
        <div className="pt-16 h-screen overflow-y-hidden overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
