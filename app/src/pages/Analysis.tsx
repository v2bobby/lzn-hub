import { useParams, Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc-client'

function Navbar() {
  const { logout } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[rgba(10,16,69,0.08)] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0a1045"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#d4a373"/></svg>
          <span className="text-lg font-bold text-[#1a1a1a]">Lenzer<span className="font-medium">Hub</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-[#475569] hover:text-[#1a1a1a] transition-colors">Dashboard</Link>
          <button onClick={logout} className="text-sm text-[#475569] hover:text-[#ef4444] transition-colors">Sign Out</button>
        </div>
      </div>
    </nav>
  )
}

function SeverityIcon({ severity }: { severity: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: 'bg-red-50', text: 'text-red-700', label: 'Critical' },
    high: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'High' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Medium' },
    low: { bg: 'bg-green-50', text: 'text-green-700', label: 'Low' },
  }
  const c = colors[severity] || colors.low
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

function RiskScoreRing({ score }: { score: number }) {
  const color = score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#10b981'
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#1a1a1a]">{score}</span>
        <span className="text-xs text-[#6b7b8c]">/ 100</span>
      </div>
    </div>
  )
}

export default function Analysis() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true })

  const { data: contract, isLoading } = trpc.contract.get.useQuery(
    { id: Number(id) },
    { enabled: !!id && !authLoading }
  )

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f5f0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#f4f5f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6b7b8c] mb-4">Contract not found</p>
          <Link to="/dashboard" className="text-[#d4a373] hover:text-[#1a1a1a] transition-colors">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const findings = (contract as any).findings || []
  const criticalCount = findings.filter((f: any) => f.severity === 'critical').length
  const highCount = findings.filter((f: any) => f.severity === 'high').length

  return (
    <div className="min-h-screen bg-[#f4f5f0]">
      <Navbar />
      <div className="pt-24 pb-12 max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/dashboard" className="text-[#6b7b8c] hover:text-[#1a1a1a] transition-colors">Dashboard</Link>
          <span className="text-[#a0abb8]">/</span>
          <span className="text-[#1a1a1a] font-medium">Analysis Report</span>
        </div>

        {/* Report Header */}
        <div className="bg-white rounded-xl border border-[rgba(10,16,69,0.06)] p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-2">{contract.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b7b8c]">
                {contract.vendor && <span className="capitalize">{contract.vendor}</span>}
                <span className="capitalize px-2.5 py-0.5 bg-[#f4f5f0] rounded-full text-xs font-medium">{contract.contractType}</span>
                <span>{new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            {contract.riskScore !== null && (
              <div className="flex items-center gap-6">
                <RiskScoreRing score={contract.riskScore} />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#6b7b8c] mb-1">Risk Score</p>
                  <p className={`text-lg font-bold ${
                    contract.riskScore > 70 ? 'text-red-600' :
                    contract.riskScore > 40 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {contract.riskScore > 70 ? 'High Risk' :
                     contract.riskScore > 40 ? 'Medium Risk' :
                     'Low Risk'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {contract.summary && (
            <div className="mt-6 p-4 bg-[#f4f5f0] rounded-lg border border-[rgba(10,16,69,0.04)]">
              <p className="text-sm text-[#475569] leading-relaxed">{contract.summary}</p>
            </div>
          )}

          {/* Severity counts */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-xl font-bold text-red-700">{criticalCount}</p>
              <p className="text-xs text-red-600">Critical</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-xl font-bold text-orange-700">{highCount}</p>
              <p className="text-xs text-orange-600">High</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xl font-bold text-yellow-700">{findings.filter((f: any) => f.severity === 'medium').length}</p>
              <p className="text-xs text-yellow-600">Medium</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xl font-bold text-green-700">{findings.filter((f: any) => f.severity === 'low').length}</p>
              <p className="text-xs text-green-600">Low</p>
            </div>
          </div>
        </div>

        {/* Findings */}
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Detailed Findings ({findings.length})</h2>
        <div className="space-y-4">
          {findings.map((finding: any, i: number) => (
            <div key={finding.id} className="bg-white rounded-xl border border-[rgba(10,16,69,0.06)] overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#0a1045] text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <h3 className="text-base font-semibold text-[#1a1a1a]">{finding.clauseName}</h3>
                  </div>
                  <SeverityIcon severity={finding.severity} />
                </div>
                {finding.category && (
                  <span className="inline-block px-2.5 py-0.5 bg-[#f4f5f0] rounded-full text-xs text-[#6b7b8c] font-medium mb-4">{finding.category}</span>
                )}

                {finding.explanation && (
                  <p className="text-sm text-[#475569] leading-relaxed mb-5 p-3 bg-blue-50 rounded-lg border-l-2 border-blue-400">
                    {finding.explanation}
                  </p>
                )}

                {finding.originalText && (
                  <div className="mb-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-red-600 mb-2 flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Current Language
                    </p>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-sm text-[#475569] line-through opacity-70">{finding.originalText}</p>
                    </div>
                  </div>
                )}

                {finding.suggestedText && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-green-600 mb-2 flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Suggested Replacement
                    </p>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-sm text-[#1a1a1a] font-medium">{finding.suggestedText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-[#6b7b8c] hover:text-[#1a1a1a] transition-colors"
          >
            &larr; Back to Dashboard
          </button>
          <button
            onClick={() => alert('Export feature coming soon')}
            className="px-5 py-2.5 bg-[#0a1045] text-white rounded-full text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}
