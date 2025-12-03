import React from 'react';

// --- 1. Komponen Kartu Ringkasan (Top Summary Cards) ---
interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, change, isPositive }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-w-0">
    <div className="p-3 mr-4 text-white bg-orange-500 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      <span
        className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
      >
        {change}
      </span>
    </div>
  </div>
);

// --- 2. Komponen Utama Dashboard ---
const Dashboard: React.FC = () => {
  const summaryData = [
    { icon: '📦', title: 'Total Orders', value: '48,652', change: '1.58%', isPositive: true },
    { icon: '👤', title: 'Total Customer', value: '1,248', change: '0.42%', isPositive: true },
    { icon: '💰', title: 'Total Revenue', value: '$215,860', change: '2.36%', isPositive: true },
  ];

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="p-6 bg-white rounded-xl shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      {/* HEADER / NAVIGATION BAR */}
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search anything"
            className="p-2 border border-gray-300 rounded-lg text-sm"
          />
          {/* Ikon Notifikasi dan Profil */}
          <span className="text-xl text-gray-600">🔔</span>
          <span className="text-xl text-gray-600">👤</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: Kiri (2/3 Lebar) */}
        <div className="lg:col-span-2">
          {/* 1. Baris Kartu Ringkasan Atas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {summaryData.map((data) => (
              <SummaryCard key={data.title} {...data} />
            ))}
          </div>

          {/* 2. Grafik Total Revenue */}
          <Section title="Total Revenue">
            <p className="text-3xl font-extrabold text-gray-900 mb-4">$184,839</p>
            {/* Placeholder untuk komponen grafik */}
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">

[Image of Line Chart Placeholder]
</div>
          </Section>

          {/* 3. Orders Overview (Bar Chart) */}
          <Section title="Orders Overview">
            <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg"></div>
          </Section>

          {/* 4. Recent Orders (Tabel) */}
          <Section title="Recent Orders">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Menu', 'Qty', 'Amount', 'Customer', 'Status'].map(header => (
                    <th key={header} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Contoh Baris */}
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD1026</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Salmon Sushi Roll</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">$30.00</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Dana White</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">On Process</span>
                  </td>
                </tr>
                {/* ... data lainnya */}
              </tbody>
            </table>
          </Section>

          {/* 5. Customer Reviews (Grid) */}
          <Section title="Customer Reviews">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Review Card 1 */}
              <div className="p-4 border rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold">Classic Italian Penne</h4>
                <p className="text-sm text-gray-600 truncate">The pasta is divine! The flavors were perfect...</p>
                <span className="text-yellow-400 text-sm">⭐️⭐️⭐️⭐️⭐️ 5.0</span>
              </div>
              {/* Review Card 2 */}
              <div className="p-4 border rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold">Smokey Supreme Pizza</h4>
                <p className="text-sm text-gray-600 truncate">Crispy crust, generous cheese, and excellent smokey flavor...</p>
                <span className="text-yellow-400 text-sm">⭐️⭐️⭐️⭐️ 4.5</span>
              </div>
            </div>
          </Section>
        </div>

        {/* COLUMN 2: Kanan (1/3 Lebar) */}
        <div className="lg:col-span-1">
          {/* 1. Trending Menus */}
          <Section title="Trending Menus">
            <div className="space-y-4">
              {/* Menu Item 1 */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url(placeholder-url-chicken.jpg)' }}></div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">Grilled Chicken Delight</h4>
                  <p className="text-sm text-gray-500">Chicken</p>
                </div>
                <span className="text-lg font-bold text-orange-500">$18.00</span>
              </div>
              {/* ... menu item lainnya */}
            </div>
          </Section>

          {/* 2. Top Categories (Donut Chart) */}
          <Section title="Top Categories">
            <div className="h-40 mb-4 bg-gray-100 flex items-center justify-center rounded-lg">

[Image of Donut Chart Placeholder]
</div>
            <ul className="text-sm space-y-1">
              <li>Seafood <span className="float-right font-bold">30%</span></li>
              <li>Beverages <span className="float-right font-bold">25%</span></li>
              {/* ... kategori lainnya */}
            </ul>
          </Section>

          {/* 3. Recent Activity (List) */}
          <Section title="Recent Activity">
            <div className="space-y-4 text-sm">
              <div className="pb-3 border-b">
                <p>Sylvester Quil **Updated inventory** - 10 Units...</p>
                <p className="text-xs text-gray-500">11:20 AM</p>
              </div>
              <div className="pb-3">
                <p>Maria Kings **Marked** order #ORD1026 as completed</p>
                <p className="text-xs text-gray-500">11:00 AM</p>
              </div>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
