import { useEffect, useRef, useState } from 'react'

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

const categories = ['All', 'Contract Negotiation', 'SaaS Buying', 'Legal Ops', 'Product Updates', 'Company News']

const articles = [
  { title: 'The 10 Most Dangerous Clauses in SaaS Contracts (And How to Fix Them)', author: 'LenzerHub Team', date: 'July 2026', readTime: '8 min', category: 'Contract Negotiation', featured: true },
  { title: 'Understanding Liability Caps: A Guide for Non-Lawyers', author: 'LenzerHub Team', date: 'June 2026', readTime: '6 min', category: 'Contract Negotiation' },
  { title: 'Auto-Renewal Clauses: How to Spot and Kill Them', author: 'LenzerHub Team', date: 'June 2026', readTime: '5 min', category: 'SaaS Buying' },
  { title: 'Benchmarking Your SaaS Contract: What the Data Says', author: 'LenzerHub Team', date: 'May 2026', readTime: '7 min', category: 'SaaS Buying' },
  { title: 'Indemnification 101: Who Pays When Something Goes Wrong?', author: 'LenzerHub Team', date: 'May 2026', readTime: '6 min', category: 'Legal Ops' },
  { title: 'IP Ownership in Freelancer Agreements: What Founders Miss', author: 'LenzerHub Team', date: 'April 2026', readTime: '5 min', category: 'Legal Ops' },
  { title: 'How to Build a Contract Playbook for Your Startup', author: 'LenzerHub Team', date: 'April 2026', readTime: '8 min', category: 'Contract Negotiation' },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const sections = Array.from({ length: 3 }, () => useScrollReveal())

  const filteredArticles = activeCategory === 'All' ? articles.slice(1) : articles.slice(1).filter((a) => a.category === activeCategory)
  const featured = articles[0]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      console.log('Subscribed:', email)
    }
  }

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">Resources</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            The LenzerHub Resource Center
          </h1>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.75)] mt-5 max-w-[560px] mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            Practical guides, negotiation tactics, and contract intelligence for SMBs.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-white py-16 md:py-20" ref={sections[1]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="bg-[#f4f5f0] rounded-2xl overflow-hidden border border-[rgba(10,16,69,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
              <div className="bg-gradient-to-br from-[#0a1045] to-[#1b3a5c] p-10 lg:p-12 flex flex-col justify-center">
                <span className="inline-block self-start bg-[#d4a373] text-[#0a1045] font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-wider px-3 py-1 rounded-full font-medium mb-4">
                  Featured
                </span>
                <h2 className="font-['Playfair_Display'] font-semibold text-white text-[1.5rem] md:text-[1.75rem] leading-tight">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-3 mt-4 text-[rgba(255,255,255,0.6)] font-['Inter'] text-[0.8125rem]">
                  <span>{featured.author}</span>
                  <span>&middot;</span>
                  <span>{featured.date}</span>
                  <span>&middot;</span>
                  <span>{featured.readTime} read</span>
                </div>
                <button className="mt-6 self-start text-[#d4a373] font-['Inter'] text-[0.9375rem] font-medium hover:text-white transition-colors">
                  Read Article &rarr;
                </button>
              </div>
              <div className="bg-[#f4f5f0] p-10 lg:p-12 flex items-center justify-center">
                <div className="w-full h-48 bg-gradient-to-br from-[rgba(10,16,69,0.05)] to-[rgba(212,163,115,0.1)] rounded-xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#d4a373] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="bg-[#f4f5f0] py-16 md:py-20" ref={sections[2]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-['Inter'] text-[0.8125rem] font-medium transition-all duration-300 ${
                  activeCategory === cat ? 'bg-[#0a1045] text-white' : 'bg-white text-[#6b7b8c] hover:bg-[rgba(10,16,69,0.05)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <button key={article.title} className="bg-white rounded-xl p-6 border border-[rgba(10,16,69,0.06)] text-left hover:shadow-lg transition-shadow duration-300 group">
                <div className="w-full h-32 bg-gradient-to-br from-[rgba(10,16,69,0.03)] to-[rgba(212,163,115,0.08)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#d4a373] opacity-30 group-hover:opacity-60 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="font-['JetBrains_Mono'] text-[0.6875rem] uppercase tracking-wider text-[#d4a373]">{article.category}</span>
                <h3 className="font-['Inter'] font-semibold text-[1.0625rem] text-[#0a1045] mt-2 leading-snug group-hover:text-[#d4a373] transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-[#a0abb8] font-['Inter'] text-[0.75rem]">
                  <span>{article.author}</span>
                  <span>&middot;</span>
                  <span>{article.date}</span>
                  <span>&middot;</span>
                  <span>{article.readTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#0a1045] py-20 md:py-24">
        <div className="max-w-[600px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.5rem, 2vw, 1.75rem)', lineHeight: 1.2 }}>
            Get Negotiation Tactics Delivered to Your Inbox
          </h2>
          {subscribed ? (
            <p className="font-['Inter'] text-[#d4a373] mt-6">Thanks for subscribing! Check your inbox soon.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] sm:rounded-r-none rounded-full sm:rounded-l-full px-6 py-3.5 font-['Inter'] text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d4a373]"
              />
              <button
                type="submit"
                className="bg-[#d4a373] text-[#0a1045] sm:rounded-l-none rounded-full sm:rounded-r-full px-7 py-3.5 font-['Inter'] text-[0.875rem] font-semibold hover:bg-white transition-all duration-300 mt-3 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
