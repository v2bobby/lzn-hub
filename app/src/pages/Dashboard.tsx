import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc-client'

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[rgba(10,16,69,0.08)] flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0a1045"/><path d="M8 10h16M8 14h12M8 18h14M8 22h10" stroke="#d4a373" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="23" r="3" fill="#d4a373"/></svg>
          <span className="text-lg font-bold text-[#1a1a1a]">Lenzer<span className="font-medium">Hub</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm text-[#475569] hover:text-[#1a1a1a] transition-colors hidden sm:block">About</Link>
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0a1045] flex items-center justify-center text-white text-xs font-bold">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button onClick={logout} className="text-sm text-[#475569] hover:text-[#ef4444] transition-colors">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[rgba(10,16,69,0.06)]">
      <p className="text-sm text-[#6b7b8c] mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true })
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data: stats } = trpc.contract.stats.useQuery(undefined, { enabled: !!user })
  const { data: contractList, isLoading: listLoading } = trpc.contract.list.useQuery(undefined, { enabled: !!user })

  const createMutation = trpc.contract.create.useMutation({
    onSuccess: (data) => {
      setUploadStep('analyzing')
      analyzeMutation.mutate({ contractId: data.id })
    },
  })

  const analyzeMutation = trpc.contract.analyze.useMutation({
    onSuccess: (data) => {
      setUploadStep('done')
      setResultId(data.contractId)
      utils.contract.list.invalidate()
      utils.contract.stats.invalidate()
    },
  })

  const deleteMutation = trpc.contract.delete.useMutation({
    onSuccess: () => {
      utils.contract.list.invalidate()
      utils.contract.stats.invalidate()
    },
  })

  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle')
  const [resultId, setResultId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', vendor: '', contractType: 'saas' as const })

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setUploadStep('uploading')
    createMutation.mutate({
      title: form.title,
      vendor: form.vendor || undefined,
      contractType: form.contractType,
      fileName: `${form.title}.pdf`,
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f4f5f0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f5f0]">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">Dashboard</h1>
          <p className="text-sm text-[#6b7b8c] mt-1">Welcome back{user?.name ? `, ${user.name}` : ''}. Upload and analyze your contracts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Contracts" value={stats?.totalContracts ?? 0} color="#0a1045" />
          <StatCard label="Analyzed" value={stats?.analyzedContracts ?? 0} color="#10b981" />
          <StatCard label="Avg Risk Score" value={`${stats?.avgRiskScore ?? 0}/100`} color="#d4a373" />
          <StatCard label="Findings" value={stats?.totalFindings ?? 0} color="#ef4444" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Upload Panel */}
          <div>
            <div className="bg-white rounded-xl border border-[rgba(10,16,69,0.06)] p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Upload Contract</h2>

              {uploadStep === 'idle' && (
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Contract Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Salesforce MSA 2026"
                      className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Vendor Name</label>
                    <input
                      type="text"
                      value={form.vendor}
                      onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                      placeholder="e.g. Salesforce"
                      className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1a1a1a] mb-1.5">Contract Type</label>
                    <select
                      value={form.contractType}
                      onChange={(e) => setForm({ ...form, contractType: e.target.value as typeof form.contractType })}
                      className="w-full px-4 py-2.5 border border-[rgba(10,16,69,0.1)] rounded-lg text-sm focus:outline-none focus:border-[#d4a373] transition-colors bg-white"
                    >
                      <option value="saas">SaaS MSA</option>
                      <option value="vendor">Vendor Agreement</option>
                      <option value="sow">Statement of Work</option>
                      <option value="freelancer">Freelancer Contract</option>
                      <option value="lease">Office Lease</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="border-2 border-dashed border-[rgba(10,16,69,0.12)] rounded-lg p-6 text-center">
                    <svg className="w-8 h-8 text-[#d4a373] mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p className="text-xs text-[#6b7b8c]">PDF, DOCX, or scanned images accepted</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0a1045] text-white rounded-full py-3 text-sm font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all"
                  >
                    Analyze Contract
                  </button>
                </form>
              )}

              {uploadStep === 'uploading' && (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-[#1a1a1a] font-medium">Uploading contract...</p>
                </div>
              )}

              {uploadStep === 'analyzing' && (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-[#1a1a1a] font-medium">AI analysis in progress...</p>
                  <p className="text-xs text-[#6b7b8c] mt-2">Scanning 50+ clause types</p>
                </div>
              )}

              {uploadStep === 'done' && resultId && (
                <div className="text-center py-6">
                  <svg className="w-12 h-12 text-[#10b981] mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <p className="text-sm text-[#1a1a1a] font-medium mb-1">Analysis Complete</p>
                  <p className="text-xs text-[#6b7b8c] mb-4">Your contract has been analyzed</p>
                  <button
                    onClick={() => navigate(`/analysis/${resultId}`)}
                    className="w-full bg-[#d4a373] text-[#1a1a1a] rounded-full py-3 text-sm font-semibold hover:bg-[#0a1045] hover:text-white transition-all"
                  >
                    View Report
                  </button>
                  <button
                    onClick={() => { setUploadStep('idle'); setResultId(null); setForm({ title: '', vendor: '', contractType: 'saas' }); }}
                    className="w-full mt-2 text-xs text-[#6b7b8c] hover:text-[#1a1a1a] transition-colors"
                  >
                    Analyze Another
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contract List */}
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Your Contracts</h2>
            {listLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !contractList?.length ? (
              <div className="bg-white rounded-xl border border-[rgba(10,16,69,0.06)] p-12 text-center">
                <svg className="w-12 h-12 text-[rgba(10,16,69,0.1)] mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p className="text-sm text-[#6b7b8c]">No contracts yet. Upload your first contract to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contractList.map((contract) => (
                  <div key={contract.id} className="bg-white rounded-xl border border-[rgba(10,16,69,0.06)] p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#1a1a1a] truncate">{contract.title}</h3>
                          {contract.status === 'completed' && contract.riskScore !== null && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              (contract.riskScore || 0) > 70 ? 'bg-red-100 text-red-700' :
                              (contract.riskScore || 0) > 40 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {contract.riskScore}/100
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6b7b8c]">
                          {contract.vendor && <span>{contract.vendor}</span>}
                          <span className="capitalize">{contract.contractType}</span>
                          <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {contract.status === 'completed' ? (
                          <button
                            onClick={() => navigate(`/analysis/${contract.id}`)}
                            className="px-4 py-2 bg-[#0a1045] text-white rounded-full text-xs font-medium hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all"
                          >
                            View
                          </button>
                        ) : contract.status === 'analyzing' ? (
                          <span className="flex items-center gap-1.5 text-xs text-[#d4a373]">
                            <span className="w-2 h-2 bg-[#d4a373] rounded-full animate-pulse" />
                            Analyzing
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-[#f4f5f0] text-[#6b7b8c] rounded-full text-xs">Uploaded</span>
                        )}
                        <button
                          onClick={() => { if (confirm('Delete this contract?')) deleteMutation.mutate({ id: contract.id }); }}
                          className="p-1.5 text-[#a0abb8] hover:text-[#ef4444] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
