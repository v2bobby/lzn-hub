import { useState, useEffect, useRef } from 'react'
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

const industries = [
  {
    id: 'saas',
    label: 'SaaS Companies',
    pain: 'Managing 20+ vendor tools, auto-renewal traps, liability caps that expose the business',
    solution: 'LenzerHub scans every SaaS MSA for auto-renewal clauses, liability caps, and data ownership terms. Get renewal alerts 60 days before deadlines.',
    stat: 'Saved $180K',
    statDesc: 'in avoided auto-renewals for a 75-person SaaS company',
  },
  {
    id: 'agency',
    label: 'Marketing Agencies',
    pain: 'Complex client MSAs, vague SOWs, freelancer agreements with unclear IP ownership',
    solution: 'Standardize client contracts with playbook enforcement. Ensure every SOW has clear scope, payment terms, and IP ownership clauses.',
    stat: '3x Faster',
    statDesc: 'contract turnaround for a 50-person marketing agency',
  },
  {
    id: 'healthcare',
    label: 'Healthcare Clinics',
    pain: 'Complex vendor agreements, payer contracts with opaque terms, HIPAA compliance addendums',
    solution: 'Flag HIPAA-related clauses in every vendor agreement. Identify missing Business Associate Agreements and compliance gaps automatically.',
    stat: '100% Compliance',
    statDesc: 'HIPAA addendum detection across all vendor contracts',
  },
  {
    id: 'services',
    label: 'Professional Services',
    pain: 'Scope creep in engagement letters, ambiguous retainer agreements, unclear deliverables',
    solution: 'Protect against scope creep with clear deliverables language. Standardize engagement letters and retainer terms across all clients.',
    stat: '40% Reduction',
    statDesc: 'in scope creep disputes for a consulting firm',
  },
]

const roles = [
  { title: 'Procurement', icon: 'P', desc: 'Speed up vendor onboarding with standardized review. Build vendor scorecards from contract data.', features: ['Automated vendor risk scoring', 'Standardized review workflows', 'Vendor comparison reports'] },
  { title: 'Finance', icon: 'F', desc: 'Control costs with renewal tracking and budget impact analysis. Never miss a price increase clause.', features: ['Renewal deadline tracking', 'Budget impact analysis', 'Price escalation detection'] },
  { title: 'Legal', icon: 'L', desc: 'First-pass review in minutes, not days. Enforce playbook compliance and maintain consistency.', features: ['First-pass AI review', 'Playbook enforcement', 'Consistency checking'] },
  { title: 'Founders', icon: 'X', desc: 'Founder-friendly MSAs, SAFE note guidance, and investor agreement review without the $800/hr rate.', features: ['Founder-friendly templates', 'SAFE note guidance', 'Investor agreement review'] },
]

export default function Solutions() {
  const [activeIndustry, setActiveIndustry] = useState('saas')
  const sections = Array.from({ length: 4 }, () => useScrollReveal())

  const active = industries.find((i) => i.id === activeIndustry)!

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">Solutions</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            Built for How You Work
          </h1>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.75)] mt-5 max-w-[560px] mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            Industry-specific solutions tailored to the unique contract challenges your business faces.
          </p>
        </div>
      </section>

      {/* Industry Tabs */}
      <section className="bg-white py-20 md:py-28" ref={sections[1]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveIndustry(ind.id)}
                className={`px-5 py-2.5 rounded-full font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${
                  activeIndustry === ind.id ? 'bg-[#0a1045] text-white' : 'bg-[#f4f5f0] text-[#6b7b8c] hover:bg-[rgba(10,16,69,0.1)]'
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-4" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
                {active.label}
              </h2>
              <div className="mb-6">
                <p className="font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-[0.08em] text-[#d4a373] mb-2">The Challenge</p>
                <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed">{active.pain}</p>
              </div>
              <div className="mb-8">
                <p className="font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-[0.08em] text-[#d4a373] mb-2">How LenzerHub Helps</p>
                <p className="font-['Inter'] text-[1rem] text-[#0a1045] leading-relaxed">{active.solution}</p>
              </div>
              <div className="bg-[#f4f5f0] rounded-xl p-6 inline-block">
                <p className="font-['Playfair_Display'] font-bold text-[2rem] text-[#d4a373]">{active.stat}</p>
                <p className="font-['Inter'] text-[0.875rem] text-[#6b7b8c]">{active.statDesc}</p>
              </div>
            </div>
            <div className="bg-[#f4f5f0] rounded-xl p-8 border border-[rgba(10,16,69,0.06)]">
              <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-[#0a1045] mb-4">Key Features for {active.label}</h3>
              <ul className="space-y-3">
                {[
                  'Auto-renewal clause detection',
                  'Liability cap analysis',
                  'Plain-English explanations',
                  'Benchmark data comparison',
                  'Team collaboration tools',
                  'Export to Word/PDF',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-[#d4a373] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Solutions */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[2]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">By Role</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              Built for Every Role
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.title} className="bg-white rounded-xl p-8 border border-[rgba(10,16,69,0.06)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0a1045] flex items-center justify-center text-white font-['Inter'] font-bold text-lg">
                    {role.icon}
                  </div>
                  <h3 className="font-['Inter'] font-semibold text-[1.25rem] text-[#0a1045]">{role.title}</h3>
                </div>
                <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] leading-relaxed mb-4">{role.desc}</p>
                <ul className="space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] shrink-0" />
                      <span className="font-['Inter'] text-[0.875rem] text-[#6b7b8c]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1045] py-20 md:py-24" ref={sections[3]}>
        <div className="max-w-[700px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Find Your Solution
          </h2>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.7)] mt-4 mb-8">
            Talk to our team about how LenzerHub can solve your specific contract challenges.
          </p>
          <Link to="/contact" className="inline-block bg-[#d4a373] text-[#0a1045] rounded-full px-9 py-4 font-['Inter'] text-[0.9375rem] font-semibold hover:bg-white transition-all duration-300">
            Talk to Sales
          </Link>
        </div>
      </section>
    </main>
  )
}
