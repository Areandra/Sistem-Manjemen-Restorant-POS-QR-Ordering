import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '~/layout/AdminLayout'

export interface UserItem {
  id: number
  name: string
  email: string
  role: string | null
  avatarUrl: string | null
  status: 'active' | 'disabled'
  createdAt: string
  updatedAt: string
}

interface UserIndexProps {
  data: UserItem[]
}

const UserManagementIndex = ({ data = [] }: UserIndexProps) => {
  const toggleStatus = (id: number, currentStatus: string) => {
    router.post(`/users/${id}/toggle-status`, {
      status: currentStatus === 'active' ? 'disabled' : 'active',
    })
  }

  return (
    <AdminLayout overflow={'hidden'}>
      <Head title="Manajemen User" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Manajemen Pengguna</h2>

          <button
            onClick={() => router.get('/users/create')}
            className="bg-[#F39C12] hover:bg-[#d68910] text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <span className="mr-2">+</span> User Baru
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-[#F39C12] focus:border-[#F39C12]"
          />
        </div>

        <div className="h-[77.5vh] overflow-y-auto space-y-4">
          {data.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    u.avatarUrl ??
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(u.name) +
                      '&background=f39c12&color=fff'
                  }
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    {u.name}
                    {u.role && (
                      <span className="px-2 py-1 rounded bg-gray-800 text-white text-xs uppercase">
                        {u.role}
                      </span>
                    )}
                  </h3>

                  <p className="text-gray-500 text-sm">{u.email}</p>

                  <p className="text-gray-600 text-xs mt-1">
                    Dibuat: {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(u.id, u.status)}
                  className={`py-1 px-3 rounded-md text-white font-semibold text-sm transition-colors duration-150 ${
                    u.status === 'active'
                      ? 'bg-[#E74C3C] hover:bg-[#c0392b]'
                      : 'bg-[#27AE60] hover:bg-[#219754]'
                  }`}
                >
                  {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>

                <Link
                  href={`/users/update/${u.id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default UserManagementIndex
