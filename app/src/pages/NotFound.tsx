import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f5f0] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1a1a1a] mb-2">404</h1>
        <p className="text-[#6b7b8c] mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-[#0a1045] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
