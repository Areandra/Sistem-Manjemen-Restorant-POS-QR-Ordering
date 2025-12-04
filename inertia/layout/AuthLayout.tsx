import { Link } from 'lucide-react'
import { PropsWithChildren } from 'react'

interface GuestLayoutProps extends PropsWithChildren {}

export default function AuthLayout({ children }: GuestLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:block w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-12">
          <h1 className="text-white text-5xl font-bold mb-4 leading-tight">
            Peminjaman barang untad
          </h1>
          <p className="text-white text-lg">
            Booking barang yang kamu butuhkan <br />
            Ambil barang hanya dengan scan barcode
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-8">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              Sign in
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
