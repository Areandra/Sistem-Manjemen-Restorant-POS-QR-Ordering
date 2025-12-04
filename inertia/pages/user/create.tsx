import React, { FormEventHandler } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'

const UserCreate: React.FC = ({ roles = [], initialData }: any) => {
  const { data, setData, post, processing, errors } = useForm(
    initialData || {
      name: '',
      email: '',
      password: '',
      role: roles[0],
      status: 'active',
      avatarUrl: '',
    }
  )

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post('')
  }

  return (
    <AdminLayout>
      <Head title="Tambah User Baru" />

      <div className="p-6 h-full">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tambah User Baru</h2>

            <Link
              href="/users"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition duration-150"
            >
              ✖
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nama lengkap"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="contoh@email.com"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {!initialData?.password && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="********"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* ROLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  {roles.map((r: string) => (
                    <option key={r} value={r}>
                      {r[0].toUpperCase() + r.slice(1, r.length)}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              {/* AVATAR URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={data.avatarUrl}
                  onChange={(e) => setData('avatarUrl', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatarUrl && (
                  <p className="text-red-500 text-xs mt-1">{errors.avatarUrl}</p>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex justify-end space-x-4 mt-4 border-t pt-6">
              <Link
                href="/users"
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={processing || !data.name || !data.email || !data.password}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400"
              >
                {processing ? 'Menyimpan...' : 'Simpan User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default UserCreate
