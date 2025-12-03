import { Link, usePage } from '@inertiajs/react'

export default function CustomerOrderLayout({ children }: any) {
  const { url } = usePage()

  const navItems = [
    { name: 'Menu', href: url.split('/cart')[0].split('/order')[0] },
    { name: 'Cart', href: `${url.split('/session')[0]}${url}/cart` },
    { name: 'Pesanan', href: `${url.split('/session')[0]}${url}/order` },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8EC] font-sans">
      {/* NAV */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md px-4 py-3 flex gap-8 justify-center">
        {navItems.map((n, i) => (
          <Link
            key={i}
            href={n.href}
            className="text-lg font-semibold hover:text-orange-500 transition"
          >
            {n.name}
          </Link>
        ))}
      </div>

      <div className="p-5">{children}</div>
    </div>
  )
}
