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

const integrations = [
  { name: 'Slack', desc: 'Get instant alerts when contracts are flagged or ready for review' },
  { name: 'Salesforce', desc: 'Sync contract data with your CRM pipeline' },
  { name: 'Google Drive', desc: 'One-click import and export of contract documents' },
  { name: 'Dropbox', desc: 'Direct access to your contract files' },
  { name: 'HubSpot', desc: 'Connect contract workflows to your sales process' },
  { name: 'Zapier', desc: 'Automate contract tasks across 5,000+ apps' },
]

export default function Product() {
  const sections = Array.from({ length: 5 }, () => useScrollReveal())

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">Product</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            How LenzerHub Works
          </h1>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.75)] mt-5 max-w-[560px] mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            AI contract negotiation in three simple steps. Upload, analyze, and negotiate with confidence.
          </p>
        </div>
      </section>

      {/* Upload & Parse */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[1]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Step 1</p>
              <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-5" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
                Upload &amp; Parse
              </h2>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed mb-4">
                Drag and drop any contract — PDF, Word, or even scanned images. Our OCR engine handles multi-page documents with 99%+ accuracy, extracting every clause and term automatically.
              </p>
              <ul className="space-y-3">
                {['Multi-format support (PDF, DOCX, scanned images)', 'Advanced OCR with 99%+ accuracy', 'Multi-page document handling', 'Automatic clause segmentation'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#d4a373] mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-[0_10px_40px_rgba(10,16,69,0.08)] border border-[rgba(10,16,69,0.06)]">
              <div className="border-2 border-dashed border-[rgba(10,16,69,0.15)] rounded-lg p-12 text-center">
                <svg className="w-12 h-12 text-[#d4a373] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="font-['Inter'] text-[1rem] text-[#0a1045] font-medium">Drop your contract here</p>
                <p className="font-['Inter'] text-[0.8125rem] text-[#a0abb8] mt-1">or click to browse PDF, Word, or image files</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Engine */}
      <section className="bg-white py-20 md:py-28" ref={sections[2]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(10,16,69,0.12)]">
              <img src="/images/dashboard.jpg" alt="LenzerHub AI Analysis Dashboard" className="w-full h-auto" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Step 2</p>
              <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-5" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
                AI Analysis Engine
              </h2>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed mb-4">
                Our AI checks 50+ clause types across all major contract categories. Each risk is scored by severity and translated into plain English — no law degree required.
              </p>
              <ul className="space-y-3">
                {['50+ clause types analyzed', 'Severity scoring (Low / Medium / High / Critical)', 'Plain-English risk explanations', 'Context-aware recommendations'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#d4a373] mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Counter-Proposal Generation */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[3]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Step 3</p>
              <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-5" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
                Counter-Proposal Generation
              </h2>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed mb-4">
                Generate a redlined counter-proposal with industry-standard replacement language. Export to Word or PDF with a single click. Benchmark data shows what similar companies negotiated.
              </p>
              <ul className="space-y-3">
                {['Industry-standard replacement clauses', 'Benchmark data from 100K+ contracts', 'Side-by-side Before/After comparison', 'Export to Word or PDF'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#d4a373] mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-[0_10px_40px_rgba(10,16,69,0.08)] border border-[rgba(10,16,69,0.06)]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[rgba(239,68,68,0.1)] text-[#ef4444] font-['JetBrains_Mono'] text-[0.6875rem] uppercase">Before</span>
                  <span className="px-3 py-1 rounded-full bg-[rgba(16,185,129,0.1)] text-[#10b981] font-['JetBrains_Mono'] text-[0.6875rem] uppercase">After</span>
                </div>
                <div className="p-4 bg-[rgba(239,68,68,0.05)] border-l-2 border-[#ef4444] rounded-r-lg">
                  <p className="font-['Inter'] text-[0.875rem] text-[#0a1045] line-through opacity-60">
                    "Vendor's liability shall be limited to the amount paid in the 12 months preceding the claim."
                  </p>
                </div>
                <div className="p-4 bg-[rgba(16,185,129,0.05)] border-l-2 border-[#10b981] rounded-r-lg">
                  <p className="font-['Inter'] text-[0.875rem] text-[#0a1045]">
                    "Vendor's liability shall be limited to the greater of (a) $500,000 or (b) the amount paid in the 12 months preceding the claim."
                  </p>
                  <p className="font-['Inter'] text-[0.75rem] text-[#6b7b8c] mt-2 italic">Based on benchmark data — 73% of similar companies negotiated this change</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration & Workflow */}
      <section className="bg-white py-20 md:py-28" ref={sections[3]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              Collaboration &amp; Workflow
            </h2>
            <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] mt-3 max-w-[600px] mx-auto">
              Invite your team, leave comments, set up approval chains, and track every version. Contract negotiation is a team sport.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Team Comments', desc: 'Comment on any clause and @mention teammates for input' },
              { title: 'Approval Chains', desc: 'Set up custom approval workflows based on contract value or risk' },
              { title: 'Version History', desc: 'Every change tracked. Compare versions side-by-side' },
              { title: 'Export Options', desc: 'Export to Word, PDF, or share a secure link' },
            ].map((item) => (
              <div key={item.title} className="bg-[#f4f5f0] rounded-xl p-6">
                <div className="w-10 h-[2px] bg-[#d4a373] mb-4" />
                <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-[#0a1045]">{item.title}</h3>
                <p className="font-['Inter'] text-[0.875rem] text-[#6b7b8c] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="bg-[#0a1045] py-20 md:py-28" ref={sections[4]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Security</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              Security &amp; Compliance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'SOC 2 Type II Certified', desc: 'Independent audit validates our security controls and processes' },
              { title: 'AES-256 Encryption', desc: 'Encryption at rest and in transit. Your data is always protected' },
              { title: 'Zero Data Retention', desc: 'We never use your contracts to train our AI models. Period.' },
            ].map((item) => (
              <div key={item.title} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 text-center">
                <svg className="w-10 h-10 text-[#d4a373] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-white">{item.title}</h3>
                <p className="font-['Inter'] text-[0.875rem] text-[rgba(255,255,255,0.6)] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[4]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Integrations</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
              Fits Into Your Workflow
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((item) => (
              <div key={item.name} className="bg-white rounded-xl p-6 border border-[rgba(10,16,69,0.06)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0a1045] flex items-center justify-center text-white font-['Inter'] font-bold text-sm">
                    {item.name[0]}
                  </div>
                  <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-[#0a1045]">{item.name}</h3>
                </div>
                <p className="font-['Inter'] text-[0.875rem] text-[#6b7b8c] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[700px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Experience the Demo
          </h2>
          <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] mt-4 mb-8">
            See LenzerHub in action with a live walkthrough of the platform.
          </p>
          <Link to="/contact" className="inline-block bg-[#0a1045] text-white rounded-full px-9 py-4 font-['Inter'] text-[0.9375rem] font-medium hover:bg-[#d4a373] hover:text-[#0a1045] transition-all duration-300">
            Schedule a Demo
          </Link>
        </div>
      </section>
    </main>
  )
}
