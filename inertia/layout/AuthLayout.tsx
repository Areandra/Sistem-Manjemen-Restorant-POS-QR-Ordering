import { PropsWithChildren } from 'react'

interface GuestLayoutProps extends PropsWithChildren {}

export default function AuthLayout({ children }: GuestLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-12">
          <h1 className="text-white text-5xl font-bold mb-4 leading-tight">Sistem POS Restoran</h1>
          <p className="text-white text-lg">
            Kelola pesanan, meja, dan laporan harian <br />
            Semua transaksi restoran Anda dalam satu platform
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
