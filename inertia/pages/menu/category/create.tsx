import React, { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'

const MenusCreate: React.FC = ({ initialData }: any) => {
  const { data, setData, post, processing, errors } = useForm(
    initialData || {
      name: '',
      description: '',
      sortOrder: 0,
    }
  )

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post('')
  }

  return (
    <AdminLayout>
      <Head title="Tambah Kategori Menu" />

      <div className="p-6 h-full">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tambah Kategori Menu</h2>

            <Link
              href="/menu"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition duration-150"
            >
              ✖
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3
                           focus:ring-orange-500 focus:border-orange-500"
                placeholder="Contoh: Minuman, Makanan Utama"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3
                           focus:ring-orange-500 focus:border-orange-500"
                placeholder="Opsional, contoh: Menu kategori untuk makanan ringan"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={data.sortOrder}
                onChange={(e) => setData('sortOrder', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3
                           focus:ring-orange-500 focus:border-orange-500"
                placeholder="Angka urutan kategori"
                required
              />
              {errors.sortOrder && <p className="text-red-500 text-xs mt-1">{errors.sortOrder}</p>}
            </div>

            <div className="flex justify-end space-x-4 mt-4 border-t pt-6">
              <Link
                href="/menu"
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm
                           text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={processing || !data.name}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm
                           text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700
                           disabled:bg-orange-400"
              >
                {processing ? 'Menyimpan...' : 'Simpan Kategori'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default MenusCreate
