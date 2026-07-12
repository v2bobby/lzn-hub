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

const allFeatures = [
  'Contract reviews',
  'Basic risk scanner',
  'Standard clause library',
  'Email support',
  'Users included',
  'Benchmark data',
  'Counter-language generator',
  'Slack integration',
  'Renewal alerts',
  'Priority support',
  'Unlimited reviews',
  'API access',
  'Custom playbooks',
  'SSO & SAML',
  'Dedicated account manager',
]

const plans = [
  {
    name: 'Starter',
    monthly: 119,
    annual: 99,
    annualBilled: 990,
    features: ['5/mo', 'Yes', 'Yes', 'Yes', '1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    monthly: 359,
    annual: 299,
    annualBilled: 2990,
    features: ['25/mo', 'Yes', 'Yes', 'Yes', '5', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '-', '-', '-', '-', '-'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Scale',
    monthly: 959,
    annual: 799,
    annualBilled: 7990,
    features: ['Unlimited', 'Yes', 'Yes', 'Yes', 'Unlimited', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    cta: 'Contact Sales',
    popular: false,
  },
  {
    name: 'Enterprise',
    monthly: 0,
    annual: 0,
    annualBilled: 0,
    features: ['Custom', 'Yes', 'Yes', 'Yes', 'Unlimited', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const addOns = [
  { name: 'On-demand attorney review', price: '$150/hour' },
  { name: 'Additional users', price: '$29/user/month' },
  { name: 'Custom template library setup', price: '$499 one-time' },
]

const faqs = [
  { q: 'Can I change plans?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'What counts as a "contract review"?', a: 'One uploaded document, regardless of length or number of pages. Each upload counts as one review against your monthly limit.' },
  { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee on all paid plans. No questions asked.' },
  { q: 'Is there a free version?', a: 'We offer a 14-day free trial with full access to all features. There is no perpetual free tier.' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const sections = Array.from({ length: 5 }, () => useScrollReveal())

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">Pricing</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            Straightforward Pricing.
          </h1>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.75)] mt-4 max-w-[500px] mx-auto italic" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            No auto-renewal traps. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[1]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 flex">
              <button onClick={() => setAnnual(false)} className={`px-6 py-2.5 rounded-full font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${!annual ? 'bg-[#0a1045] text-white' : 'text-[#6b7b8c]'}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-6 py-2.5 rounded-full font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${annual ? 'bg-[#0a1045] text-white' : 'text-[#6b7b8c]'}`}>Annual <span className="text-[0.75rem] opacity-70">-20%</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-white border rounded-2xl p-8 relative ${plan.popular ? 'border-[#d4a373] md:-translate-y-2' : 'border-[rgba(10,16,69,0.08)]'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4a373] text-[#0a1045] font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-wider px-4 py-1 rounded-full font-medium">Most Popular</span>
                )}
                <h3 className="font-['Inter'] font-semibold text-[1.25rem] text-[#0a1045]">{plan.name}</h3>
                {plan.name === 'Enterprise' ? (
                  <div className="mt-3">
                    <span className="font-['Playfair_Display'] font-bold text-[#0a1045]" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)' }}>Custom</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="font-['Playfair_Display'] font-bold text-[#0a1045]" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)' }}>${annual ? plan.annual : plan.monthly}</span>
                    <span className="font-['Inter'] text-[0.9375rem] text-[#a0abb8]">/mo</span>
                  </div>
                )}
                {plan.name !== 'Enterprise' && (
                  <p className="font-['Inter'] text-[0.8125rem] text-[#a0abb8] mt-1">
                    {annual ? `Billed annually $${plan.annualBilled}` : 'Billed monthly'}
                  </p>
                )}
                <div className="border-t border-[rgba(10,16,69,0.08)] my-5" />
                <Link
                  to="/contact"
                  className={`block text-center rounded-full py-3 font-['Inter'] text-[0.875rem] font-medium transition-all duration-300 ${
                    plan.popular ? 'bg-[#0a1045] text-white hover:bg-[#d4a373] hover:text-[#0a1045]' : 'border-[1.5px] border-[#0a1045] text-[#0a1045] hover:bg-[#0a1045] hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-white py-20 md:py-28" ref={sections[2]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] text-center mb-12" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-[#0a1045]">
                  <th className="text-left py-4 font-['Inter'] text-[0.9375rem] font-semibold text-[#0a1045]">Feature</th>
                  {plans.slice(0, 3).map((p) => (
                    <th key={p.name} className="text-center py-4 font-['Inter'] text-[0.9375rem] font-semibold text-[#0a1045]">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={`border-b ${i % 2 === 0 ? 'bg-[#f4f5f0]' : 'bg-white'}`}>
                    <td className="py-3.5 font-['Inter'] text-[0.875rem] text-[#0a1045]">{feature}</td>
                    {plans.slice(0, 3).map((p) => (
                      <td key={p.name} className="text-center py-3.5">
                        {p.features[i] === 'Yes' ? (
                          <svg className="w-4 h-4 text-[#10b981] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : p.features[i] === '-' ? (
                          <span className="text-[#a0abb8]">&mdash;</span>
                        ) : (
                          <span className="font-['Inter'] text-[0.8125rem] text-[#6b7b8c]">{p.features[i]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-[#f4f5f0] py-16 md:py-20" ref={sections[3]}>
        <div className="max-w-[800px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] text-center mb-8" style={{ fontSize: 'clamp(1.5rem, 2vw, 1.75rem)', lineHeight: 1.1 }}>
            Add-Ons
          </h2>
          <div className="space-y-4">
            {addOns.map((addon) => (
              <div key={addon.name} className="bg-white rounded-xl p-5 flex items-center justify-between border border-[rgba(10,16,69,0.06)]">
                <span className="font-['Inter'] text-[0.9375rem] text-[#0a1045]">{addon.name}</span>
                <span className="font-['Inter'] font-semibold text-[0.9375rem] text-[#d4a373]">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="bg-white py-20 md:py-28" ref={sections[4]}>
        <div className="max-w-[800px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-[#0a1045] text-center mb-12" style={{ fontSize: 'clamp(1.5rem, 2vw, 1.75rem)', lineHeight: 1.1 }}>
            Pricing FAQ
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[rgba(10,16,69,0.1)]">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-6 text-left group" aria-expanded={openFaq === i}>
                  <span className={`font-['Inter'] text-[1rem] font-medium transition-colors duration-300 ${openFaq === i ? 'text-[#d4a373]' : 'text-[#0a1045] group-hover:text-[#d4a373]'}`}>{faq.q}</span>
                  <svg className={`w-5 h-5 text-[#0a1045] shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: openFaq === i ? '200px' : '0', opacity: openFaq === i ? 1 : 0 }}>
                  <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] leading-relaxed pb-6">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1045] py-20 md:py-24">
        <div className="max-w-[700px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Still Have Questions?
          </h2>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.7)] mt-4 mb-8">
            Talk to our sales team for a personalized quote or custom requirements.
          </p>
          <Link to="/contact" className="inline-block bg-[#d4a373] text-[#0a1045] rounded-full px-9 py-4 font-['Inter'] text-[0.9375rem] font-semibold hover:bg-white transition-all duration-300">
            Talk to Sales
          </Link>
        </div>
      </section>
    </main>
  )
}
