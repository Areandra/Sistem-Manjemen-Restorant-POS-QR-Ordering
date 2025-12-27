import { useEffect, useState } from 'react'

const FullscreenWrapper = ({ children }: any) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true))

  useEffect(() => {
    if (document.fullscreenElement) {
      setIsFullscreen(true)
    } else {
      setIsFullscreen(false)
    }
  })

  if (isClient) {
    document?.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    })
  }

  const handleStart = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  if (isFullscreen) {
    return children
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
        <div className="text-center max-w-md">
          {/* <img src={IMG} className="w-full h-auto rounded-lg mb-6 border" /> */}

          <h1 className="text-5xl font-extrabold text-red-500 mb-2">Selamat Datang</h1>
          <p className="text-xl font-semibold mb-3">Akses Ditolak</p>

          <p className="text-gray-600 mb-4">
            Klik tombol di bawah untuk masuk ke mode layar penuh.
          </p>

          {/* <p className="font-medium mb-6">
            Mengalihkan dalam <span className="text-red-500 font-bold text-2xl">{count}</span>{' '}
            detik...
          </p> */}
          <button
            className="px-5 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
            onClick={handleStart}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Aktifkan Fullscreen
          </button>
        </div>
      </div>
    </div>
  )
}

export default FullscreenWrapper
