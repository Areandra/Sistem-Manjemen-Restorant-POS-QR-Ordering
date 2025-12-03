import { Link, usePage } from '@inertiajs/react'
import {
  Menu, // Menggantikan HomeIcon atau ikon Menu
  ShoppingCart, // Menggantikan ShoppingCartIcon
  ClipboardList, // Menggantikan ClipboardListIcon
} from 'lucide-react' // Import ikon dari 'lucide-react'

export default function CustomerOrderLayout({ children, sessionToken }: any) {
  const { url } = usePage() // Mengambil URL saat ini dari Inertia

  // Definisikan item navigasi dengan ikon Lucide
  const navItems = [
    {
      name: 'Menu',
      href: `/order/session/${sessionToken}`,
      icon: Menu, // Icon Lucide: Menu
      match: new RegExp(`^/order/session/${sessionToken}$`),
    },
    {
      name: 'Cart',
      href: `/order/session/${sessionToken}/cart`,
      icon: ShoppingCart, // Icon Lucide: ShoppingCart
      match: new RegExp(`^/order/session/${sessionToken}/cart`),
    },
    {
      name: 'Pesanan',
      href: `/order/session/${sessionToken}/order`,
      icon: ClipboardList, // Icon Lucide: ClipboardList
      match: new RegExp(`^/order/session/${sessionToken}/order`),
    },
  ]

  return (
    <div className="flex min-h-screen font-sans pb-16">
      {' '}
      {/* Tambah padding-bottom agar konten tidak tertutup navbar */}
      {/* Konten Utama */}
      <div className="w-full h-full">
        <div className="w-full h-full">{children}</div>
      </div>
      {/* --- MOBILE NAVIGATION BAR (Fixed Bottom) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-100">
        <nav className="flex h-16 max-w-lg mx-auto justify-around items-center">
          {navItems.map((n, i) => {
            // Tentukan apakah link ini aktif
            const isActive = n.match.test(url)

            // Ambil Komponen Ikon
            const IconComponent = n.icon

            return (
              <Link
                key={i}
                href={n.href}
                className={`flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? 'text-orange-600' // Warna untuk link aktif
                      : 'text-gray-500 hover:text-orange-500' // Warna untuk link non-aktif
                  }
                `}
              >
                {/* Ikon Lucide */}
                <IconComponent className="w-6 h-6" />

                {/* Teks */}
                <span className="text-xs mt-0.5">{n.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
