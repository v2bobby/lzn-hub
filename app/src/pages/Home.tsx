import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0a1045"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#d4a373"/></svg>
          <span className={`text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-[#1a1a1a]' : 'text-white'}`}>Lenzer<span className="font-medium">Hub</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#475569] hover:text-[#d4a373]' : 'text-white/80 hover:text-white'}`}>Features</a>
          <a href="#product" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#475569] hover:text-[#d4a373]' : 'text-white/80 hover:text-white'}`}>Product</a>
          <Link to="/about" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#475569] hover:text-[#d4a373]' : 'text-white/80 hover:text-white'}`}>About</Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#1a1a1a] hover:text-[#d4a373]' : 'text-white hover:text-[#d4a373]'}`}>Dashboard</Link>
              <button onClick={logout} className={`text-sm transition-colors ${scrolled ? 'text-[#475569] hover:text-[#ef4444]' : 'text-white/80 hover:text-[#ef4444]'}`}>Sign Out</button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#d4a373] text-[#1a1a1a] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white transition-all">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0a1045] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#d4a373"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#0a1045" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#0a1045"/></svg>
              <span className="text-lg font-bold">Lenzer<span className="font-medium">Hub</span></span>
            </div>
            <p className="text-sm text-white/50">Never sign a bad contract again. AI-powered contract negotiation for SMBs.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <div className="space-y-2"><Link to="/dashboard" className="block text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link><a href="#features" className="block text-sm text-white/50 hover:text-white transition-colors">Features</a><a href="#product" className="block text-sm text-white/50 hover:text-white transition-colors">How It Works</a></div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <div className="space-y-2"><Link to="/about" className="block text-sm text-white/50 hover:text-white transition-colors">About</Link><a href="mailto:contactus@lenzerhub.com" className="block text-sm text-white/50 hover:text-white transition-colors">Contact</a></div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="space-y-2"><span className="block text-sm text-white/50">Privacy Policy</span><span className="block text-sm text-white/50">Terms of Service</span></div>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">&copy; 2026 LenzerHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect } from 'react'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#f4f5f0]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1045] via-[#1b3a5c] to-[#0a1045]" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,163,115,0.3) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#d4a373] mb-4">AI-Powered Contract Intelligence</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6">
                Never Sign a<br />Bad Contract Again
              </h1>
              <p className="text-lg text-white/75 max-w-lg mb-8 leading-relaxed">
                Upload any contract. Our AI scans 50+ clause types, flags hidden risks, and generates redlined counter-proposals in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="inline-block bg-[#d4a373] text-[#1a1a1a] rounded-full px-8 py-3.5 font-semibold hover:bg-white transition-all shadow-lg shadow-[#d4a373]/25">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="inline-block bg-[#d4a373] text-[#1a1a1a] rounded-full px-8 py-3.5 font-semibold hover:bg-white transition-all shadow-lg shadow-[#d4a373]/25">
                      Try It Free
                    </Link>
                    <a href="#product" className="inline-block border border-white/30 text-white rounded-full px-8 py-3.5 font-medium hover:bg-white/10 transition-all">
                      See How It Works
                    </a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#d4a373] flex items-center justify-center text-[#1a1a1a] text-xs font-bold">A</div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">B</div>
                  <div className="w-8 h-8 rounded-full bg-[#d4a373]/80 flex items-center justify-center text-[#1a1a1a] text-xs font-bold">C</div>
                </div>
                <p className="text-sm text-white/60">Trusted by 500+ growing companies</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  <span className="text-xs text-white/40 ml-2 font-mono">Contract Analysis</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border-l-2 border-[#ef4444]">
                    <div><p className="text-sm text-white font-medium">Auto-Renewal Clause</p><p className="text-xs text-white/50">10-day notice window</p></div>
                    <span className="px-2 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs rounded-full font-medium">Critical</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border-l-2 border-[#ef4444]">
                    <div><p className="text-sm text-white font-medium">Liability Cap</p><p className="text-xs text-white/50">No minimum floor</p></div>
                    <span className="px-2 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs rounded-full font-medium">Critical</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border-l-2 border-[#f59e0b]">
                    <div><p className="text-sm text-white font-medium">Indemnification</p><p className="text-xs text-white/50">One-sided in vendor's favor</p></div>
                    <span className="px-2 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs rounded-full font-medium">High</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border-l-2 border-[#10b981]">
                    <div><p className="text-sm text-white font-medium">IP Assignment</p><p className="text-xs text-white/50">Standard terms</p></div>
                    <span className="px-2 py-1 bg-[#10b981]/20 text-[#10b981] text-xs rounded-full font-medium">Low</span>
                  </div>
                </div>
                <div className="mt-3 p-2.5 bg-[#d4a373]/10 rounded-lg border border-[#d4a373]/20">
                  <p className="text-xs text-[#d4a373] font-mono uppercase tracking-wider mb-1">Overall Risk Score</p>
                  <p className="text-2xl font-bold text-white">72<span className="text-sm text-white/50">/100</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE PRODUCT PREVIEW */}
      <section id="product" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Live Product</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">From Upload to Analysis in 3 Minutes</h2>
            <p className="text-[#6b7b8c] max-w-2xl mx-auto">A real, working application. Sign up, upload a contract, and get an AI-powered risk analysis instantly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f4f5f0] rounded-2xl p-6 border border-[rgba(10,16,69,0.06)]">
              <div className="w-12 h-12 rounded-xl bg-[#0a1045] flex items-center justify-center text-white font-bold text-lg mb-4">1</div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Upload</h3>
              <p className="text-sm text-[#6b7b8c] leading-relaxed">Drag and drop any PDF, Word doc, or scanned contract. Our system handles multi-page documents with OCR.</p>
            </div>
            <div className="bg-[#f4f5f0] rounded-2xl p-6 border border-[rgba(10,16,69,0.06)]" style={{transitionDelay: '0.1s'}}>
              <div className="w-12 h-12 rounded-xl bg-[#0a1045] flex items-center justify-center text-white font-bold text-lg mb-4">2</div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">AI Analysis</h3>
              <p className="text-sm text-[#6b7b8c] leading-relaxed">Our AI scans 50+ clause types, scores each risk by severity, and translates legalese into plain English.</p>
            </div>
            <div className="bg-[#f4f5f0] rounded-2xl p-6 border border-[rgba(10,16,69,0.06)]" style={{transitionDelay: '0.2s'}}>
              <div className="w-12 h-12 rounded-xl bg-[#0a1045] flex items-center justify-center text-white font-bold text-lg mb-4">3</div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Negotiate</h3>
              <p className="text-sm text-[#6b7b8c] leading-relaxed">Download a redlined counter-proposal with industry-standard replacement language and benchmark data.</p>
            </div>
          </div>
          {!isAuthenticated && (
            <div className="text-center mt-8">
              <Link to="/login" className="inline-block bg-[#0a1045] text-white rounded-full px-8 py-3.5 font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all">
                Create Free Account &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-12 md:py-16 bg-[#f4f5f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Everything You Need to Negotiate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Risk Scanner', desc: 'AI detects 50+ risky clause types across all major contract categories' },
              { title: 'Plain English', desc: 'No legalese. Know exactly what you\'re agreeing to with clear explanations' },
              { title: 'Counter-Language', desc: 'Industry-standard replacement clauses tailored to your situation' },
              { title: 'Benchmark Data', desc: 'See what similar companies negotiated — "40% reduction is typical"' },
              { title: 'Renewal Alerts', desc: 'Never miss an auto-renewal deadline again. Get notified 60 days early' },
              { title: 'SOC 2 Certified', desc: 'Bank-grade encryption. Your contracts are never used to train AI models' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-[rgba(10,16,69,0.06)]">
                <div className="w-10 h-[2px] bg-[#d4a373] mb-4" />
                <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6b7b8c] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#d4a373] mb-3">Leadership</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-8">Meet the Founder</h2>
          <div className="bg-[#f4f5f0] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#0a1045] flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl font-bold text-[#d4a373]">DE</span>
            </div>
            <h3 className="text-xl font-semibold text-[#1a1a1a]">David Emeh</h3>
            <p className="text-sm text-[#d4a373] mt-1">Founder &amp; CEO</p>
            <p className="text-sm text-[#6b7b8c] mt-4 leading-relaxed">
              Former product lead at a legal-tech startup, David spent years watching SMBs get outmaneuvered in contract negotiations simply because they lacked the tools to understand what they were signing. He founded LenzerHub to put enterprise-grade contract intelligence into the hands of every growing business.
            </p>
            <a href="https://www.linkedin.com/in/david-emeh-956534309" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 text-sm text-[#6b7b8c] hover:text-[#1a1a1a] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              View LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0a1045] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stop Guessing. Start Negotiating.</h2>
          <p className="text-white/70 mb-6">Your first contract analysis is free. Sign up and see what you've been missing.</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="inline-block bg-[#d4a373] text-[#1a1a1a] rounded-full px-8 py-3.5 font-semibold hover:bg-white transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="inline-block bg-[#d4a373] text-[#1a1a1a] rounded-full px-8 py-3.5 font-semibold hover:bg-white transition-all">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
