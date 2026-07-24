import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[rgba(10,16,69,0.08)] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0a1045"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#d4a373"/></svg>
          <span className="text-lg font-bold text-[#1a1a1a]">Lenzer<span className="font-medium">Hub</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-[#475569] hover:text-[#1a1a1a] transition-colors">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-[#475569] hover:text-[#1a1a1a] transition-colors">Dashboard</Link>
              <button onClick={logout} className="text-sm text-[#475569] hover:text-[#ef4444] transition-colors">Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="bg-[#0a1045] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

const values = [
  { title: 'Transparency', desc: 'No black-box AI. We show you exactly why we flagged something.' },
  { title: 'Empowerment', desc: "We don't replace judgment; we supercharge it." },
  { title: 'Security', desc: 'Your contracts are sacred. We treat them that way.' },
  { title: 'Accessibility', desc: 'Enterprise-grade tools at SMB-friendly prices.' },
]

const timeline = [
  { year: '2025', label: 'Idea', desc: 'Founded after watching a 50-person company get locked into a $200K auto-renewal' },
  { year: '2025', label: 'Beta', desc: 'Launched private beta with 50 SMBs across SaaS, healthcare, and professional services' },
  { year: '2026', label: 'Launch', desc: 'Public launch with full feature set' },
  { year: '2026', label: '500+ Customers', desc: 'Crossed 500 paying customers within 6 months' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#f4f5f0]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-[#0a1045] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,163,115,0.5) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-4">About LenzerHub</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">We're Building the Future of Fair Deals</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6">Our Mission</h2>
          <p className="text-lg text-[#6b7b8c] leading-relaxed italic">
            "Every business deserves to negotiate from a position of strength. LenzerHub was founded on the belief that AI should level the playing field between growing companies and enterprise vendors."
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-10 md:py-14 bg-[#f4f5f0]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Leadership</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Meet the Founder</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-10 max-w-lg mx-auto border border-[rgba(10,16,69,0.06)]">
            <div className="w-20 h-20 rounded-full bg-[#0a1045] flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl font-bold text-[#d4a373]">DE</span>
            </div>
            <h3 className="text-xl font-semibold text-[#1a1a1a] text-center">David Emeh</h3>
            <p className="text-sm text-[#d4a373] text-center mt-1">Founder &amp; CEO</p>
            <p className="text-sm text-[#6b7b8c] leading-relaxed mt-5 text-center">
              Former product lead at a legal-tech startup, David spent years watching SMBs get outmaneuvered in contract negotiations simply because they lacked the tools to understand what they were signing. He founded LenzerHub to put enterprise-grade contract intelligence into the hands of every growing business — because a great product shouldn't require a $500/hr attorney to buy safely.
            </p>
            <div className="text-center mt-6">
              <a
                href="https://www.linkedin.com/in/david-emeh-956534309"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a1045] text-white rounded-full text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                View LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Values</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-[#f4f5f0] rounded-xl p-6">
                <div className="w-10 h-[2px] bg-[#d4a373] mb-4" />
                <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6b7b8c] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 md:py-14 bg-[#f4f5f0]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Our Story</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">From Frustration to Innovation</h2>
          </div>
          <div className="relative">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0a1045] flex items-center justify-center text-white font-mono text-xs font-medium">{item.year.slice(-2)}</div>
                  {i < timeline.length - 1 && <div className="w-[2px] flex-1 bg-[rgba(10,16,69,0.1)] mt-2 min-h-[40px]" />}
                </div>
                <div className="pb-4">
                  <p className="font-mono text-xs text-[#d4a373] uppercase tracking-wider">{item.year}</p>
                  <h3 className="text-base font-semibold text-[#1a1a1a] mt-1">{item.label}</h3>
                  <p className="text-sm text-[#6b7b8c] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1045] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#d4a373"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#0a1045" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#0a1045"/></svg>
              <span className="text-lg font-bold">Lenzer<span className="font-medium">Hub</span></span>
            </div>
            <p className="text-xs text-white/40">&copy; 2026 LenzerHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
