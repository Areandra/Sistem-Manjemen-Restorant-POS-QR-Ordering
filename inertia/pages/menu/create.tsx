// File: ~/pages/menuitem/create.tsx
import React, { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'

// Opsi kategori dan ketersediaan
// Asumsi categoryOptions di-pass sebagai props
// const categoryOptions = [{ id: 1, name: 'Makanan Utama' }, { id: 2, name: 'Minuman' }]

const MenuItemsCreate: React.FC = ({ initialData, categoryOptions = [] }: any) => {
  const { data, setData, post, processing, errors } = useForm(
    initialData || {
      name: '',
      categoryId: categoryOptions[0]?.id || 1, // Pilih kategori pertama atau default 1
      description: '',
      price: 0,
      costOfGoods: 0,
      imageUrl: '',
      isAvailable: true,
      sku: '',
    }
  )

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post('') // Endpoint POST untuk item menu
  }

  return (
    <AdminLayout>
      <Head title="Tambah Item Menu Baru" />

      <div className="p-6 h-full">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tambah Item Menu Baru</h2>

            <Link
              href="/menu"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition duration-150"
            >
              ✖
            </Link>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kolom kiri: Detail Produk */}
            <div className="space-y-6">
              {/* Nama Produk */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Item</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Contoh: Nasi Goreng Spesial"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                <select
                  value={data.categoryId}
                  onChange={(e) => setData('categoryId', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  {categoryOptions.map((cat: { id: number; name: string }) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Penjelasan singkat tentang item menu ini."
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Kolom kanan: Harga & Status */}
            <div className="space-y-6">
              {/* Harga Jual */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Jual (Rp)</label>
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => setData('price', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="25000"
                  min="0"
                  required
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* HPP (Cost of Goods) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">HPP / Biaya Bahan (Rp)</label>
                <input
                  type="number"
                  value={data.costOfGoods}
                  onChange={(e) => setData('costOfGoods', parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="10000"
                  min="0"
                />
                {errors.costOfGoods && <p className="text-red-500 text-xs mt-1">{errors.costOfGoods}</p>}
              </div>

              {/* Ketersediaan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status Ketersediaan</label>
                <select
                  value={data.isAvailable ? 'true' : 'false'}
                  onChange={(e) => setData('isAvailable', e.target.value === 'true')}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  <option value="true">Tersedia di Menu</option>
                  <option value="false">Tidak Tersedia / Habis</option>
                </select>
                {errors.isAvailable && <p className="text-red-500 text-xs mt-1">{errors.isAvailable}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU / Kode Produk</label>
                <input
                  type="text"
                  value={data.sku}
                  onChange={(e) => setData('sku', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="NFG-001"
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
              </div>

              {/* Image URL (Placeholder, idealnya ini menggunakan file upload) */}
               <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar</label>
                <input
                  type="url"
                  value={data.imageUrl}
                  onChange={(e) => setData('imageUrl', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="http://example.com/gambar.jpg"
                />
                {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
              </div>
            </div>


            {/* Tombol aksi */}
            <div className="md:col-span-2 flex justify-end space-x-4 mt-4 border-t pt-6">
              <Link
                href="/menu"
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={processing || !data.name || data.price <= 0}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400"
              >
                {processing ? 'Menyimpan...' : 'Simpan Item Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default MenuItemsCreate
