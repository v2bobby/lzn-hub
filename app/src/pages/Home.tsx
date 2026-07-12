import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas'

/* ─────────── ScrollReveal helper ─────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ─────────── Hero Section ─────────── */
function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-end" style={{ minHeight: '700px' }}>
      <HeroCanvas />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(10,16,69,0.65) 0%, rgba(10,16,69,0.2) 50%, transparent 100%)',
        }}
      />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto pb-16 md:pb-24" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.1em] text-[#d4a373] mb-4">
          AI-Powered Contract Intelligence
        </p>
        <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05, textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}>
          <span className="block">AI That Reads</span>
          <span className="block">the Fine Print</span>
        </h1>
        <p className="font-['Inter'] text-[rgba(255,255,255,0.85)] mt-5 max-w-[540px]" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', lineHeight: 1.6 }}>
          LenzerHub scans your vendor contracts, flags hidden risks, and generates counter-offers in minutes — not days. Built for SMBs who can't afford a full legal team.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-10 mb-4">
          <Link
            to="/contact"
            className="inline-block bg-[#d4a373] text-[#0a1045] rounded-full px-8 py-[14px] font-['Inter'] text-[0.9375rem] font-semibold hover:bg-white transition-all duration-300 shadow-lg shadow-[rgba(212,163,115,0.25)]"
          >
            Upload Your First Contract
          </Link>
          <a
            href="#demo"
            className="inline-block bg-transparent border border-[rgba(255,255,255,0.35)] text-white rounded-full px-8 py-[14px] font-['Inter'] text-[0.9375rem] font-medium hover:border-white hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
          >
            Watch How It Works
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Trusted By ─────────── */
function TrustedBy() {
  const ref = useScrollReveal()
  const logos = ['TechFlow', 'Meridian', 'Atlas Co', 'Nexus Labs', 'BrightPath', 'Vertex Systems']
  return (
    <section className="bg-white border-b border-[rgba(10,16,69,0.08)] py-10" ref={ref}>
      <div className="max-w-[900px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#a0abb8] mb-6">
          Trusted by 500+ growing companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((name) => (
            <span key={name} className="font-['Inter'] text-[0.9375rem] font-semibold text-[#a0abb8] hover:text-[#0a1045] transition-colors duration-300 tracking-wide">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Problem Section ─────────── */
function Problem() {
  const ref = useScrollReveal()
  const cards = [
    { num: '90%', title: 'The Blind Spot', body: 'of SMBs sign contracts without legal review' },
    { num: '$400', title: 'The Cost Trap', body: 'Average legal review costs $400/hour; you have 20 contracts pending' },
    { num: '60%', title: 'The Auto-Renewal Surprise', body: 'of bad SaaS deals auto-renew because nobody tracked the deadline' },
  ]
  return (
    <section className="bg-[#f4f5f0] py-24 md:py-32" ref={ref}>
      <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0">
          <div className="lg:pr-12">
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">The Problem</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
              Why Contracts Break Deals
            </h2>
          </div>
          {cards.map((card, i) => (
            <div key={i} className={`lg:px-8 ${i > 0 ? 'lg:border-l border-[rgba(10,16,69,0.1)]' : ''}`}>
              <span className="font-['Playfair_Display'] font-bold text-[#d4a373] opacity-40 block" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 1 }}>
                {card.num}
              </span>
              <h3 className="font-['Inter'] font-semibold text-[1.25rem] text-[#0a1045] mt-2">{card.title}</h3>
              <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] leading-relaxed mt-2">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Demo Section ─────────── */
function Demo() {
  const ref = useScrollReveal()
  const steps = [
    { num: '01', title: 'Upload', desc: 'Drag & drop PDF, Word, or scanned contracts. Multi-page handling with OCR.' },
    { num: '02', title: 'Analyze', desc: 'AI scans 50+ clause types, assigns severity scores, translates to plain English.' },
    { num: '03', title: 'Respond', desc: 'Download a redlined counter-proposal with replacement language and explanations.' },
  ]
  return (
    <section id="demo" className="bg-white py-24 md:py-32" ref={ref}>
      <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
          <div>
            <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">How It Works</p>
            <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] mb-12" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
              From Upload to Negotiation-Ready in 3 Minutes
            </h2>
            <div className="space-y-10">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div className="shrink-0 w-9 h-9 rounded-full border-[1.5px] border-[#0a1045] flex items-center justify-center font-['JetBrains_Mono'] text-[0.875rem] text-[#0a1045]">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-semibold text-[1.125rem] text-[#0a1045]">{step.title}</h3>
                    <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(10,16,69,0.12)]">
            <img src="/images/dashboard.jpg" alt="LenzerHub Dashboard showing contract analysis with risk highlights" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Features Section ─────────── */
function Features() {
  const ref = useScrollReveal()
  const features = [
    { title: 'Risk Scanner', desc: 'AI detects 50+ risky clause types across all major contract categories' },
    { title: 'Plain English Explanations', desc: 'No legalese. Know exactly what you\'re agreeing to' },
    { title: 'Counter-Language Generator', desc: 'Industry-standard replacement clauses tailored to your situation' },
    { title: 'Benchmark Data', desc: '"Similar companies negotiated this clause down by 40%"' },
    { title: 'Renewal Alerts', desc: 'Never miss an auto-renewal deadline again' },
    { title: 'Secure & Confidential', desc: 'Bank-grade encryption. Your contracts are never used to train models' },
  ]
  return (
    <section className="bg-[#f4f5f0] py-24 md:py-32" ref={ref}>
      <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="text-center mb-16">
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Features</p>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
            Everything You Need to Negotiate Like a Pro
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group">
              <div className="w-10 h-[2px] bg-[#d4a373]" />
              <h3 className="font-['Inter'] font-semibold text-[1.125rem] text-[#0a1045] mt-4 group-hover:text-[#d4a373] transition-colors duration-300">{f.title}</h3>
              <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Impact Section ─────────── */
function Impact() {
  const ref = useScrollReveal()
  const stats = [
    { num: '500+', label: 'Companies Protected', desc: 'From costly auto-renewals, liability traps, and unfair terms' },
    { num: '$12M+', label: 'Risk Identified', desc: 'In hidden fees, uncapped liability, and unfavorable clauses' },
    { num: '94%', label: 'Detection Accuracy', desc: 'AI-trained on 100K+ negotiated contracts across all major categories' },
  ]
  return (
    <section className="bg-[#0a1045] py-24 md:py-32" ref={ref}>
      <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="text-center mb-16">
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Impact</p>
          <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
            Trusted by Growing Teams
          </h2>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.6)] mt-3 max-w-[540px] mx-auto">
            Real results from real SMBs who stopped guessing and started negotiating.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-10 text-center">
              <span className="font-['Playfair_Display'] font-bold text-[#d4a373] block" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1 }}>
                {s.num}
              </span>
              <h3 className="font-['Inter'] font-semibold text-[1.125rem] text-white mt-3">{s.label}</h3>
              <p className="font-['Inter'] text-[0.9375rem] text-[rgba(255,255,255,0.5)] leading-relaxed mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Pricing Section ─────────── */
function Pricing() {
  const ref = useScrollReveal()
  const [annual, setAnnual] = useState(true)
  const plans = [
    { name: 'Starter', price: annual ? 99 : 119, annualPrice: 990, reviews: '5 contract reviews/mo', features: ['Basic risk scanner', 'Standard clause library', 'Email support', '1 user'] },
    { name: 'Growth', price: annual ? 299 : 359, annualPrice: 2990, popular: true, reviews: '25 contract reviews/mo', features: ['Benchmark data', 'Counter-language generator', 'Slack integration', 'Renewal alerts', '5 users', 'Priority support'] },
    { name: 'Scale', price: annual ? 799 : 959, annualPrice: 7990, reviews: 'Unlimited reviews', features: ['API access', 'Custom clause playbooks', 'SSO & SAML', 'Dedicated account manager', 'Unlimited users'] },
  ]
  return (
    <section className="bg-[#f4f5f0] py-24 md:py-32" ref={ref}>
      <div className="max-w-[1080px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="text-center mb-12">
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-3">Pricing</p>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045]" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
            Simple Pricing. No Hidden Fees.
          </h2>
          <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] mt-2 italic">(Unlike Your Last Contract.)</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 flex">
            <button onClick={() => setAnnual(false)} className={`px-6 py-2.5 rounded-full font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${!annual ? 'bg-[#0a1045] text-white' : 'text-[#6b7b8c]'}`}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)} className={`px-6 py-2.5 rounded-full font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${annual ? 'bg-[#0a1045] text-white' : 'text-[#6b7b8c]'}`}>
              Annual <span className="text-[0.75rem] opacity-70">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white border border-[rgba(10,16,69,0.08)] rounded-2xl p-8 md:p-10 relative ${plan.popular ? 'md:-translate-y-2 border-[#d4a373]' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4a373] text-[#0a1045] font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-wider px-4 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              )}
              <h3 className="font-['Inter'] font-semibold text-[1.25rem] text-[#0a1045]">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="font-['Playfair_Display'] font-bold text-[#0a1045]" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
                  ${plan.price}
                </span>
                <span className="font-['Inter'] text-[1rem] text-[#a0abb8]">/mo</span>
              </div>
              <p className="font-['Inter'] text-[0.8125rem] text-[#a0abb8] mt-1">
                {annual ? `Billed annually $${plan.annualPrice}` : 'Billed monthly'}
              </p>
              <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] mt-3">{plan.reviews}</p>
              <div className="border-t border-[rgba(10,16,69,0.08)] my-6" />
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#d4a373] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c]">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`block text-center mt-8 rounded-full py-3.5 font-['Inter'] text-[0.9375rem] font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#0a1045] text-white hover:bg-[#d4a373] hover:text-[#0a1045]'
                    : 'border-[1.5px] border-[#0a1045] text-[#0a1045] hover:bg-[#0a1045] hover:text-white'
                }`}
              >
                Start Free 14-Day Trial
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center font-['Inter'] text-[0.8125rem] text-[#a0abb8] mt-8">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

/* ─────────── FAQ Section ─────────── */
function FAQ() {
  const ref = useScrollReveal()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = [
    { q: 'Is LenzerHub a law firm?', a: 'No — we provide AI-powered contract analysis, not legal advice. Our tool helps you identify risks and generate counter-proposals, but we always recommend having a qualified attorney review critical contracts.' },
    { q: 'What types of contracts do you support?', a: 'We support SaaS MSAs, vendor agreements, SOWs, freelancer contracts, office leases, and more. Our AI is trained on 100,000+ contracts across all major categories.' },
    { q: 'How accurate is the AI?', a: 'Our AI is trained on 100K+ negotiated contracts and achieves 94% accuracy on risk detection. We continuously improve our models with feedback from legal professionals.' },
    { q: 'Is my contract data secure?', a: 'Absolutely. We are SOC 2 Type II certified with encryption at rest and in transit. Your contracts are never used to train our models — zero data retention for AI training.' },
    { q: 'Can I integrate with my existing tools?', a: 'Yes! We offer integrations with Slack, Salesforce, Google Drive, Dropbox, HubSpot, and Zapier. Available on Growth and Scale plans.' },
    { q: 'What happens after my free trial?', a: 'Choose a plan that works for you, or export your data and walk away. No lock-in, no hidden fees, no auto-renewal traps.' },
  ]
  return (
    <section className="bg-white py-24 md:py-32" ref={ref}>
      <div className="max-w-[800px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] text-center mb-12" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.1 }}>
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[rgba(10,16,69,0.1)]">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className={`font-['Inter'] text-[1.0625rem] font-medium transition-colors duration-300 ${openIndex === i ? 'text-[#d4a373]' : 'text-[#0a1045] group-hover:text-[#d4a373]'}`}>
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-[#0a1045] shrink-0 ml-4 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-all duration-400"
                style={{ maxHeight: openIndex === i ? '300px' : '0', opacity: openIndex === i ? 1 : 0 }}
              >
                <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] leading-relaxed pb-6">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Final CTA Section ─────────── */
function FinalCTA() {
  const ref = useScrollReveal()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      console.log('Email submitted:', email)
    }
  }
  return (
    <section className="bg-[#0a1045] py-24 md:py-28" ref={ref}>
      <div className="max-w-[700px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
          Stop Guessing. Start Negotiating.
        </h2>
        <p className="font-['Inter'] text-[1.0625rem] text-[rgba(255,255,255,0.7)] mt-4">
          Your first contract review is free. Upload now and see what you've been missing.
        </p>
        {submitted ? (
          <p className="font-['Inter'] text-[1rem] text-[#d4a373] mt-10">Thanks! Check your inbox for next steps.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 mt-10 max-w-[520px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] border-r-0 sm:rounded-r-none rounded-full sm:rounded-l-full px-6 py-4 font-['Inter'] text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d4a373]"
            />
            <button
              type="submit"
              className="bg-[#d4a373] text-[#0a1045] sm:rounded-l-none rounded-full sm:rounded-r-full px-8 py-4 font-['Inter'] text-[0.9375rem] font-semibold hover:bg-white transition-all duration-300 mt-3 sm:mt-0"
            >
              Get Started
            </button>
          </form>
        )}
        <p className="font-['Inter'] text-[0.8125rem] text-[rgba(255,255,255,0.4)] mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

/* ─────────── Home Page ─────────── */
export default function Home() {
  return (
    <main>
      <Hero />
      <TrustedBy />
      <Problem />
      <Demo />
      <Features />
      <Impact />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
  )
}
