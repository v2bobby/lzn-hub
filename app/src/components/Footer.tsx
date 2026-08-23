import { Link } from 'react-router-dom'

function FooterLogo() {
  return (
    <Link to="/" className="flex items-center gap-0 group">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="mr-2 shrink-0">
        <rect width="32" height="32" rx="8" fill="#d4a373" />
        <path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#0a1045" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="23" r="3" fill="#0a1045" />
      </svg>
      <span className="font-['Playfair_Display'] text-[20px] font-bold text-white group-hover:text-[#d4a373] transition-colors duration-300">
        Lenzer
      </span>
      <span className="font-['Inter'] text-[20px] font-medium text-white group-hover:text-[#d4a373] transition-colors duration-300">
        Hub
      </span>
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0a1045] pt-20 pb-10" style={{ padding: '80px clamp(1.5rem, 5vw, 4rem) 40px' }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <FooterLogo />
            <p className="font-['Inter'] text-[0.9375rem] text-[rgba(255,255,255,0.5)] mt-3">
              Never sign a bad contract again.
            </p>
          </div>

          <div>
            <h4 className="font-['Inter'] text-[0.9375rem] font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Security', 'Integrations', 'API Docs'].map((item) => (
                <li key={item}>
                  <Link to="/product" className="font-['Inter'] text-[0.875rem] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-300 leading-[2.2]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-['Inter'] text-[0.9375rem] font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact', 'Press Kit'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'About' ? '/about' : item === 'Blog' ? '/blog' : item === 'Contact' ? '/contact' : '/about'}
                    className="font-['Inter'] text-[0.875rem] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-300 leading-[2.2]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-['Inter'] text-[0.9375rem] font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <button className="font-['Inter'] text-[0.875rem] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-300 leading-[2.2]">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['Inter'] text-[0.8125rem] text-[rgba(255,255,255,0.3)]">
            &copy; 2026 LenzerHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors" aria-label="Twitter/X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
