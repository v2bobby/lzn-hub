import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

const timeline = [
  { year: '2025', label: 'Idea', desc: 'Founded after watching a 50-person company get locked into a $200K auto-renewal' },
  { year: '2025', label: 'Beta', desc: 'Launched private beta with 50 SMBs across SaaS, healthcare, and professional services' },
  { year: '2026', label: 'Launch', desc: 'Public launch with full feature set — risk scanner, counter-proposals, and team collaboration' },
  { year: '2026', label: '500+ Customers', desc: 'Crossed 500 paying customers and $2M ARR within 6 months of launch' },
]

const values = [
  { title: 'Transparency', desc: 'No black-box AI. We show you exactly why we flagged something.' },
  { title: 'Empowerment', desc: "We don't replace judgment; we supercharge it." },
  { title: 'Security', desc: 'Your contracts are sacred. We treat them that way.' },
  { title: 'Accessibility', desc: 'Enterprise-grade tools at SMB-friendly prices.' },
]

const openRoles = [
  { title: 'Software Engineer (Full-Stack)', dept: 'Engineering', location: 'Remote' },
  { title: 'Customer Success Manager', dept: 'Success', location: 'US / Remote' },
  { title: 'Sales Development Representative', dept: 'Sales', location: 'US / Remote' },
]

export default function About() {
  const sections = Array.from({ length: 6 }, () => useScrollReveal())

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">About</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            We're Building the Future of Fair Deals
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[1]}>
        <div className="max-w-[800px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-6" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.2 }}>
            Our Mission
          </h2>
          <p className="font-['Inter'] text-[1.125rem] text-[#6b7b8c] leading-relaxed italic">
            "Every business deserves to negotiate from a position of strength. LenzerHub was founded on the belief that AI should level the playing field between growing companies and enterprise vendors."
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-20 md:py-28" ref={sections[2]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Our Story</p>
              <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-5" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
                From Frustration to Innovation
              </h2>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed mb-4">
                LenzerHub was founded in 2025 after our founder watched a 50-person company get locked into a $200,000 auto-renewal because nobody flagged a 10-day notice clause buried on page 17 of their SaaS agreement.
              </p>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed">
                That moment sparked a mission: to give SMBs the same contract intelligence that Fortune 500s pay millions for — but at a fraction of the cost. We built LenzerHub to be the smart, protective ally that reads the fine print so you don't have to.
              </p>
            </div>
            <div>
              <div className="relative">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0a1045] flex items-center justify-center text-white font-['JetBrains_Mono'] text-[0.6875rem] font-medium">
                        {item.year.slice(-2)}
                      </div>
                      {i < timeline.length - 1 && <div className="w-[2px] flex-1 bg-[rgba(10,16,69,0.1)] mt-2" />}
                    </div>
                    <div className="pb-4">
                      <span className="font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-[0.08em] text-[#d4a373]">{item.year}</span>
                      <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-[#0a1045] mt-1">{item.label}</h3>
                      <p className="font-['Inter'] text-[0.875rem] text-[#6b7b8c] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[3]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Values</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-8 border border-[rgba(10,16,69,0.06)]">
                <div className="w-10 h-[2px] bg-[#d4a373] mb-5" />
                <h3 className="font-['Inter'] font-semibold text-[1.125rem] text-[#0a1045]">{v.title}</h3>
                <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white py-20 md:py-28" ref={sections[4]}>
        <div className="max-w-[600px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Leadership</p>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-10" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Founder
          </h2>
          <div className="bg-[#f4f5f0] rounded-2xl p-10 border border-[rgba(10,16,69,0.06)]">
            <div className="w-20 h-20 rounded-full bg-[#0a1045] mx-auto flex items-center justify-center">
              <span className="font-['Playfair_Display'] text-[1.5rem] font-bold text-[#d4a373]">DE</span>
            </div>
            <h3 className="font-['Inter'] font-semibold text-[1.5rem] text-[#0a1045] mt-5">David Emeh</h3>
            <p className="font-['Inter'] text-[0.9375rem] text-[#d4a373] mt-1">Founder &amp; CEO</p>
            <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] mt-4 leading-relaxed">
              Former product lead at a legal-tech startup, David spent years watching SMBs get outmaneuvered in contract negotiations simply because they lacked the tools to understand what they were signing. He founded LenzerHub to put enterprise-grade contract intelligence into the hands of every growing business — because a great product shouldn't require a $500/hr attorney to buy safely.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.linkedin.com/in/david-emeh-956534309"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a0abb8] hover:text-[#0a1045] transition-colors"
                aria-label="David Emeh on LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="bg-[#0a1045] py-20 md:py-28" ref={sections[5]}>
        <div className="max-w-[800px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Careers</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              We're Hiring
            </h2>
            <p className="font-['Inter'] text-[rgba(255,255,255,0.7)] mt-3">
              Join us in building the future of fair deals.
            </p>
          </div>
          <div className="space-y-4">
            {openRoles.map((role) => (
              <div key={role.title} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-white">{role.title}</h3>
                  <p className="font-['Inter'] text-[0.875rem] text-[rgba(255,255,255,0.5)] mt-1">{role.dept} &middot; {role.location}</p>
                </div>
                <Link
                  to="/contact"
                  className="shrink-0 inline-block border border-[rgba(255,255,255,0.3)] text-white rounded-full px-6 py-2.5 font-['Inter'] text-[0.875rem] font-medium hover:bg-white hover:text-[#0a1045] transition-all duration-300"
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/contact" className="font-['Inter'] text-[0.9375rem] text-[#d4a373] hover:text-white transition-colors">
              View All Roles &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
