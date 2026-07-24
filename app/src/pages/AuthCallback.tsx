import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const name = searchParams.get('name')

    if (token) {
      localStorage.setItem('lh_auth_token', token)
      if (name) localStorage.setItem('lh_user_name', name)
      window.location.href = '/dashboard'
    } else {
      navigate('/login?error=auth_failed')
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-[#f4f5f0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
