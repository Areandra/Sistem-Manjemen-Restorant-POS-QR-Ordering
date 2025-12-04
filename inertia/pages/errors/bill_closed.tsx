import { useEffect, useState } from 'react'

export default function NoActiveOrder({ sessionToken }: any) {
  const [count, setCount] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => setCount((c) => c - 1), 1000)
    if (count <= 0) window.location.href = `/order/session/${sessionToken}`
    return () => clearInterval(timer)
  }, [count])
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-500 mb-2">No Active Bill</h1>

        <p className="text-lg font-semibold mb-3">Semua Bill Telah DiTutup</p>

        <p className="text-gray-600 mb-6">
          Silakan minta kasir untuk membuat bill baru sebelum memesan.
        </p>

        <p className="font-medium mb-6">
          Mengalihkan dalam <span className="text-red-500 font-bold text-2xl">{count}</span>{' '}
          detik...
        </p>
      </div>
    </div>
  )
}
