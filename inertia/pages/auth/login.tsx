import { useEffect, FormEventHandler } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import AuthLayout from '~/layout/AuthLayout'

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    return () => {
      reset('password')
    }
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post('')
  }

  return (
    <AuthLayout>
      <Head title="Login" />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back to Giventech!</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            className="mt-1 block p-2 h-8 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="mt-1 w-full p-2 h-8 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-600">Remember Me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-900 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  )
}
