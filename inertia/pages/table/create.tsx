import React, { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'

const capacityOptions = [2, 4, 6, 8, 10, 12]

const TablesCreate: React.FC = ({ initialData }: any) => {
  const { data, setData, post, processing, errors } = useForm(
    initialData || {
      table_number: '',
      capacity: 4,
    }
  )

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post('')
  }

  return (
    <AdminLayout>
      <Head title="Tambah Meja Baru" />

      <div className="p-6 h-full">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tambah Meja Baru</h2>

            <Link
              href="/table"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition duration-150"
            >
              ✖
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Meja</label>
                <input
                  type="text"
                  value={data.table_number}
                  onChange={(e) => setData('table_number', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Contoh: A1, Bar 03"
                  required
                />
                {errors.table_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.table_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Kapasitas (Orang)
                </label>
                <select
                  value={data.capacity}
                  onChange={(e) => setData('capacity', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  {capacityOptions.map((value) => (
                    <option key={value} value={value}>
                      {value} orang
                    </option>
                  ))}
                </select>
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-600">
                  QR Code akan otomatis dibuat oleh kasir ketika meja pertama kali digunakan.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4 mt-4 border-t pt-6">
              <Link
                href="/table"
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={processing || !data.table_number}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400"
              >
                {processing ? 'Menyimpan...' : 'Simpan Meja'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default TablesCreate
