import React, { PropsWithChildren } from 'react'
import { Link } from '@inertiajs/react'
import { User } from 'lucide-react'

interface HeaderLink {
  label: string
  href: string
  className?: string
}

interface CashierLayoutProps {
  headerLinks?: HeaderLink[]
}

export default function CashierLayout({
  children,
  headerLinks = [],
}: PropsWithChildren<CashierLayoutProps>) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 relative">
        <header className="fixed top-0 w-full right-0 h-16 bg-white border-b border-gray-200 px-6 z-40 flex items-center justify-between">
          <div className="p-4 pl-0 flex justify-between items-center h-16">
            <div className="relative justify-between w-8 h-full bg-red-600 rounded-lg"></div>
            <span className="ml-10 mr-4 font-bold text-lg text-white-400">Manajemen Restorant</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Render tombol dari props */}
            {headerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center ${
                  link.className || ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            <span className="text-sm font-medium text-gray-700">Hi, Admin</span>
            <User className="w-6 h-6 text-gray-600 border p-1 rounded-full" />
          </div>
        </header>

        <div className="pt-16 h-screen overflow-y-hidden overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
