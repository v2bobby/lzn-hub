import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Logo({ light = false }: { light?: boolean }) {
  const color = light ? 'text-white' : 'text-[#0a1045]'
  return (
    <Link to="/" className="flex items-center gap-0 shrink-0 group">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="mr-2 shrink-0">
        <rect width="32" height="32" rx="8" fill="#0a1045" />
        <path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="23" r="3" fill="#d4a373" />
      </svg>
      <span className={`font-['Playfair_Display'] text-[20px] font-bold ${color} group-hover:text-[#d4a373] transition-colors duration-300`}>
        Lenzer
      </span>
      <span className={`font-['Inter'] text-[20px] font-medium ${color} group-hover:text-[#d4a373] transition-colors duration-300`}>
        Hub
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const navLinks = [
    { label: 'Product', path: '/product' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(244,245,240,0.95)] backdrop-blur-[12px] shadow-sm'
            : 'bg-transparent'
        }`}
        style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-['Inter'] text-[0.9375rem] font-medium text-[#0a1045] hover:text-[#d4a373] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="inline-block bg-[#0a1045] text-white rounded-full px-7 py-3 font-['Inter'] text-[0.9375rem] font-medium hover:bg-[#d4a373] hover:text-[#0a1045] transition-all duration-300"
            >
              Start Free Trial
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-[#0a1045] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#0a1045] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#0a1045] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[rgba(244,245,240,0.98)] backdrop-blur-lg pt-[72px] md:hidden">
          <div className="flex flex-col items-center gap-8 pt-16">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-['Inter'] text-xl font-medium text-[#0a1045] hover:text-[#d4a373] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 inline-block bg-[#0a1045] text-white rounded-full px-8 py-4 font-['Inter'] text-lg font-medium hover:bg-[#d4a373] hover:text-[#0a1045] transition-all duration-300"
              onClick={() => setMobileOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
