import { useState, useEffect, useRef } from 'react'

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

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    companySize: '',
    role: '',
    message: '',
    contactMethod: 'email',
  })
  const sections = Array.from({ length: 3 }, () => useScrollReveal())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="bg-[#0a1045] py-24 md:py-32" ref={sections[0]}>
        <div className="max-w-[1280px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <p className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a373] mb-4">Contact</p>
          <h1 className="font-['Playfair_Display'] font-bold text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
            Let's Talk Contracts
          </h1>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.75)] mt-5 max-w-[560px] mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            Have a question or want to see LenzerHub in action? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="bg-[#f4f5f0] py-20 md:py-28" ref={sections[1]}>
        <div className="max-w-[1280px] mx-auto" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-[rgba(10,16,69,0.06)]">
              {submitted ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-[#10b981] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 className="font-['Playfair_Display'] font-semibold text-[1.5rem] text-[#0a1045]">Thanks!</h3>
                  <p className="font-['Inter'] text-[1rem] text-[#6b7b8c] mt-2">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-['Playfair_Display'] font-semibold text-[1.5rem] text-[#0a1045] mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]"
                        />
                      </div>
                      <div>
                        <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">Work Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]"
                      />
                    </div>
                    <div>
                      <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">Company Size</label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] bg-white"
                        >
                          <option value="">Select...</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="500+">500+ employees</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">Role</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] bg-white"
                        >
                          <option value="">Select...</option>
                          <option value="founder">Founder/CEO</option>
                          <option value="procurement">Procurement</option>
                          <option value="finance">Finance</option>
                          <option value="legal">Legal</option>
                          <option value="operations">Operations</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-1.5">How Can We Help?</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-[rgba(10,16,69,0.12)] font-['Inter'] text-[0.9375rem] text-[#0a1045] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-['Inter'] text-[0.8125rem] font-medium text-[#0a1045] mb-2">Preferred Contact Method</label>
                      <p className="font-['Inter'] text-[0.875rem] text-[#6b7b8c]">
                      We'll reach you via the email address you provided above.
                    </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0a1045] text-white rounded-full py-4 font-['Inter'] text-[0.9375rem] font-medium hover:bg-[#d4a373] hover:text-[#0a1045] transition-all duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-['Inter'] font-semibold text-[1.125rem] text-[#0a1045] mb-4">Contact Information</h3>
              <div className="flex items-start gap-4">
                <svg className="w-5 h-5 text-[#d4a373] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <p className="font-['Inter'] text-[0.8125rem] text-[#a0abb8]">Email</p>
                  <a href="mailto:contactus@lenzerhub.com" className="font-['Inter'] text-[0.9375rem] text-[#0a1045] hover:text-[#d4a373] transition-colors">
                    contactus@lenzerhub.com
                  </a>
                </div>
              </div>
              <div className="mt-8 p-6 bg-[rgba(10,16,69,0.03)] rounded-xl border border-[rgba(10,16,69,0.06)]">
                <p className="font-['Inter'] text-[0.9375rem] text-[#6b7b8c] leading-relaxed">
                  We typically respond within 24 hours. For press inquiries, partnerships, or enterprise sales, please reach out via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Demo CTA */}
      <section className="bg-[#0a1045] py-20 md:py-24" ref={sections[2]}>
        <div className="max-w-[700px] mx-auto text-center" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <h2 className="font-['Playfair_Display'] font-semibold text-white" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', lineHeight: 1.1 }}>
            Prefer a Walkthrough?
          </h2>
          <p className="font-['Inter'] text-[rgba(255,255,255,0.7)] mt-4 mb-8">
            See LenzerHub in action with your actual contracts. Schedule a 15-minute demo.
          </p>
          <button className="inline-block bg-[#d4a373] text-[#0a1045] rounded-full px-9 py-4 font-['Inter'] text-[0.9375rem] font-semibold hover:bg-white transition-all duration-300">
            Schedule a 15-Minute Demo
          </button>
        </div>
      </section>
    </main>
  )
}
