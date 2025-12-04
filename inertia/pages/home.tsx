import React from 'react'
import AdminLayout from '~/layout/AdminLayout'

// --- 1. Komponen Kartu Ringkasan (Top Summary Cards) ---
interface SummaryCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  isPositive: boolean
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, change, isPositive }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-w-0">
    <div className="p-3 mr-4 text-white bg-orange-500 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      <span className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
    </div>
  </div>
)

export default function Dashboard({
  summaryData = [],
  revenueChart,
  topCategoriesChart,
  top5Menu,
}: any) {
  console.log(top5Menu)

  const Section = ({
    title,
    children,
    className,
  }: {
    title: string
    children: React.ReactNode
    className: string
  }) => (
    <section className={'p-4 bg-white rounded-xl shadow-md' + className}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </section>
  )

  return (
    <AdminLayout overflow="hidden">
      <div className="h-full flex flex-col w-full bg-gray-50 p-5 overflow-y-auto">
        <header className="flex items-center mb-4 space-x-4">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">Bulan ini</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {summaryData.map((data: any) => (
                <SummaryCard key={data.title} {...data} />
              ))}
            </div>
            <Section title="Total Revenue" className=" flex-1 flex flex-col">
              <p className="text-3xl font-extrabold text-gray-900 mb-4">$184,839</p>
              <div className="bg-gray-100 flex-1 flex items-center justify-center rounded-lg">
                <img
                  src={`data:image/png;base64,${revenueChart}`}
                  alt="Revenue Chart"
                  className="m-3"
                />
              </div>
            </Section>
          </div>

          {/* KANAN */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Section title="Trending Menus" className=" flex-1 flex flex-col">
              <div className="space-y-4 flex-1 overflow-y-auto">
                {top5Menu.map((i: any) => (
                  <div
                    key={i.menu.name}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${i.menu.imageUrl})` }}
                    ></div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-900">{i.menu.name}</h4>
                      <p className="text-sm text-gray-500">{i.menu.category.name}</p>
                    </div>
                    <div className="">
                      <span className="text-lg font-bold text-orange-500">Rp.{i.menu.price}</span>
                      <p className="text-sm text-gray-500">{i.quantity} Porsi</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Top Categories" className=" flex-1 flex flex-col">
              <div className="h-full bg-gray-100 flex-1 flex items-center justify-center rounded-lg">
                <img
                  src={`data:image/png;base64,${topCategoriesChart}`}
                  alt="Revenue Chart"
                  className="m-3"
                />
              </div>
            </Section>
          </div>
        </main>
      </div>
    </AdminLayout>
  )
}
