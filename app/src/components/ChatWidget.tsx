import { useState, useRef, useEffect } from 'react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi! How can we help?' },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { from: 'user', text: input.trim() }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Thanks for reaching out! Our team will get back to you within 24 hours.' },
      ])
    }, 800)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0a1045] text-white flex items-center justify-center shadow-lg hover:bg-[#d4a373] hover:text-[#0a1045] transition-all duration-300"
        aria-label="Open chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] bg-white rounded-2xl shadow-2xl border border-[rgba(10,16,69,0.08)] flex flex-col overflow-hidden">
          <div className="bg-[#0a1045] px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d4a373] flex items-center justify-center text-[#0a1045] font-semibold text-sm">L</div>
            <div>
              <p className="font-['Inter'] text-sm font-semibold text-white">LenzerHub Support</p>
              <p className="font-['Inter'] text-xs text-[rgba(255,255,255,0.6)]">Typically replies in minutes</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-['Inter'] leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-[#0a1045] text-white rounded-br-md'
                    : 'bg-[#f4f5f0] text-[#0a1045] rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[rgba(10,16,69,0.08)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[rgba(10,16,69,0.12)] text-sm font-['Inter'] text-[#0a1045] placeholder:text-[#a0abb8] focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#0a1045] text-white flex items-center justify-center hover:bg-[#d4a373] hover:text-[#0a1045] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
