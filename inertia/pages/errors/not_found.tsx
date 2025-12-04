export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-500 mb-2">404</h1>

        <p className="text-xl font-semibold mb-3">Page Not Found</p>

        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>

        <a
          href="/"
          className="px-5 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
