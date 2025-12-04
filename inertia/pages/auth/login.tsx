import { useEffect, FormEventHandler } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import AuthLayout from '~/layout/AuthLayout'

const COLOR_ACCENT = '#F39C12'
const COLOR_SUCCESS = '#27AE60'
const COLOR_PRIMARY = '#3498DB'

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    return () => reset('password')
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <AuthLayout>
      <Head title="Login" />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Selamat Datang di POS Restoran!</h2>
        <p className="text-gray-600 mt-2">
          Masuk untuk mengelola pesanan, meja, dan laporan harian restoran Anda
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Anda
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            className={`mt-1 block w-full h-10 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${COLOR_ACCENT}] focus:border-[${COLOR_ACCENT}]`}
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className={`mt-1 block w-full h-10 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${COLOR_ACCENT}] focus:border-[${COLOR_ACCENT}]`}
          />
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="remember"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className={`rounded border-gray-300 text-[${COLOR_ACCENT}] focus:ring-[${COLOR_ACCENT}]`}
            />
            <span className="text-gray-600">Ingat Saya</span>
          </label>

          <Link
            href="/forgot-password"
            className={`text-[${COLOR_PRIMARY}] hover:text-[${COLOR_ACCENT}] font-medium`}
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <button
          type="submit"
          disabled={processing}
          className={`w-full bg-[${COLOR_ACCENT}] text-white py-2 rounded-md font-semibold hover:bg-[${COLOR_SUCCESS}] transition disabled:opacity-50`}
        >
          Masuk Sekarang
        </button>
      </form>
    </AuthLayout>
  )
}
