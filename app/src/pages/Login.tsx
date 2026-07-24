import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc-client'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: googleUrlData } = trpc.googleAuth.url.useQuery(undefined, {
    retry: false,
  })
  const hasGoogleOAuth = !!googleUrlData?.url

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('lh_auth_token', data.token)
      window.location.href = '/dashboard'
    },
    onError: (err) => {
      setError(err.message)
      setLoading(false)
    },
  })

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('lh_auth_token', data.token)
      window.location.href = '/dashboard'
    },
    onError: (err) => {
      setError(err.message)
      setLoading(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      loginMutation.mutate({ email, password })
    } else {
      if (!name.trim()) {
        setError('Please enter your name')
        setLoading(false)
        return
      }
      registerMutation.mutate({ name, email, password })
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f5f0] flex flex-col items-center justify-center px-6">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0a1045"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#d4a373"/></svg>
        <span className="text-2xl font-bold text-[#1a1a1a]">Lenzer<span className="font-medium">Hub</span></span>
      </Link>

      <div className="w-full max-w-sm bg-white rounded-xl border border-[rgba(10,16,69,0.08)] shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#1a1a1a]">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-[#6b7b8c] mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Start analyzing contracts for free'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors"
                required={mode === 'register'}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a1045] text-white rounded-full py-3 text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(10,16,69,0.08)]" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#a0abb8]">or</span></div>
        </div>

        {hasGoogleOAuth && (
          <button
            onClick={() => { if (googleUrlData?.url) window.location.href = googleUrlData.url }}
            className="w-full flex items-center justify-center gap-2 border border-[rgba(10,16,69,0.12)] rounded-full py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f4f5f0] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        )}

        <p className="text-center text-sm text-[#6b7b8c] mt-5">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('register'); setError('') }} className="text-[#d4a373] hover:text-[#1a1a1a] font-medium transition-colors">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError('') }} className="text-[#d4a373] hover:text-[#1a1a1a] font-medium transition-colors">Sign in</button></>
          )}
        </p>
      </div>

      <Link to="/" className="mt-6 text-sm text-[#6b7b8c] hover:text-[#1a1a1a] transition-colors">
        &larr; Back to home
      </Link>
    </div>
  )
}
