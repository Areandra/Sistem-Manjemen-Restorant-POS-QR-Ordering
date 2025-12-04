import { PropsWithChildren } from 'react'
import { Link } from '@inertiajs/react'

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
        <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 px-6 z-40 flex items-center justify-between">
          <div className="flex items-center h-16">
            <div className="w-8 h-8 bg-[#E74C3C] rounded-lg mr-4"></div>
            <span className="ml-10 mr-4 font-bold text-lg text-gray-800">Cashier & Kitchen</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Render tombol dari props */}
            {headerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`bg-[#E74C3C] hover:bg-[#F39C12] text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-150 ${
                  link.className || ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="pt-16 h-screen overflow-y-hidden overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
