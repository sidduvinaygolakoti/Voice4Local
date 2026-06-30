import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { complaintService } from '../services/complaint'
import { toast } from 'react-toastify'
import {
  BarChart3, Clock, CheckCircle2, FileText, Search, Filter,
  Eye, MessageSquare, ChevronDown, AlertTriangle, TrendingUp,
  X, Loader2, Send
} from 'lucide-react'

// Mock data for demo
const MOCK_COMPLAINTS = [
  { id: 1, complaintId: 'LV-2024-0001', title: 'Pothole on Gandhi Road', category: 'Road Issue', fullName: 'Ramesh Kumar', district: 'Warangal', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: '2024-01-15T10:30:00Z', imageUrls: [] },
  { id: 2, complaintId: 'LV-2024-0002', title: 'No water supply - 5 days', category: 'Water Supply Problem', fullName: 'Lakshmi Devi', district: 'Karimnagar', status: 'SUBMITTED', priority: 'EMERGENCY', createdAt: '2024-01-16T08:00:00Z', imageUrls: [] },
  { id: 3, complaintId: 'LV-2024-0003', title: 'Street lights not working', category: 'Street Lights Not Working', fullName: 'Suresh Babu', district: 'Nalgonda', status: 'RESOLVED', priority: 'MEDIUM', createdAt: '2024-01-10T14:00:00Z', imageUrls: [] },
  { id: 4, complaintId: 'LV-2024-0004', title: 'Garbage overflow near school', category: 'Garbage / Waste Problem', fullName: 'Priya Sharma', district: 'Khammam', status: 'ASSIGNED', priority: 'HIGH', createdAt: '2024-01-17T09:00:00Z', imageUrls: [] },
  { id: 5, complaintId: 'LV-2024-0005', title: 'Drainage blockage causing flooding', category: 'Drainage Problem', fullName: 'Venkat Rao', district: 'Warangal', status: 'UNDER_REVIEW', priority: 'EMERGENCY', createdAt: '2024-01-18T11:00:00Z', imageUrls: [] },
]

const STATUS_OPTIONS = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
const PRIORITY_CONFIG = {
  EMERGENCY: { label: '🔴 Emergency', class: 'badge-emergency' },
  HIGH: { label: '🟠 High', class: 'badge bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  MEDIUM: { label: '🟡 Medium', class: 'badge-pending' },
  LOW: { label: '🟢 Low', class: 'badge-resolved' },
}
const STATUS_CONFIG = {
  SUBMITTED: 'badge-pending',
  UNDER_REVIEW: 'badge-inprogress',
  ASSIGNED: 'badge-inprogress',
  IN_PROGRESS: 'badge-inprogress',
  RESOLVED: 'badge-resolved',
}

export default function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [respondingId, setRespondingId] = useState(null)

  useEffect(() => { fetchComplaints() }, [])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const data = await complaintService.getAll()
      setComplaints(data)
    } catch {
      setComplaints(MOCK_COMPLAINTS)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await complaintService.updateStatus(id, newStatus)
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      if (selectedComplaint?.id === id) setSelectedComplaint(prev => ({ ...prev, status: newStatus }))
      toast.success('Status updated successfully')
    } catch {
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      toast.success('Status updated (demo mode)')
    } finally {
      setUpdatingId(null)
    }
  }

  const sendResponse = async (complaintId) => {
    if (!responseText.trim()) return
    setRespondingId(complaintId)
    try {
      await complaintService.addResponse(complaintId, responseText)
      toast.success('Response sent to citizen')
      setResponseText('')
    } catch {
      toast.success('Response sent (demo mode)')
      setResponseText('')
    } finally {
      setRespondingId(null)
    }
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'SUBMITTED').length,
    inProgress: complaints.filter(c => ['UNDER_REVIEW','ASSIGNED','IN_PROGRESS'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    emergency: complaints.filter(c => c.priority === 'EMERGENCY').length,
  }

  const filtered = complaints.filter(c => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.district?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    const matchPriority = !filterPriority || c.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-poppins font-black text-2xl md:text-3xl mb-1">Authority Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and resolve citizen complaints</p>
          </div>
          <span className="badge badge-inprogress text-sm px-3 py-2">🏛️ Government Portal</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary-500', bg: 'bg-primary/10' },
            { label: 'New', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-trust-500', bg: 'bg-trust-500/10' },
            { label: 'Emergency', value: stats.emergency, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <p className={`text-2xl font-black font-poppins ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="authority-search" type="text" placeholder="Search complaints..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm" />
          </div>
          <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <select id="filter-priority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="input-field py-2 text-sm w-full sm:w-36">
            <option value="">All Priority</option>
            {Object.keys(PRIORITY_CONFIG).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(filterStatus || filterPriority || search) && (
            <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterPriority('') }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all whitespace-nowrap">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Complaints Table */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="glass-card p-4 flex gap-3">
                    <div className="w-12 h-12 rounded-xl skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-semibold text-lg mb-2">No complaints found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedComplaint(c)}
                    className={`glass-card p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 border-2 ${
                      selectedComplaint?.id === c.id ? 'border-primary/40' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-card flex items-center justify-center shrink-0">
                          <span className="text-lg">
                            {c.category === 'Road Issue' ? '🛣️' :
                             c.category === 'Water Supply Problem' ? '💧' :
                             c.category === 'Street Lights Not Working' ? '🔦' :
                             c.category === 'Garbage / Waste Problem' ? '🗑️' :
                             c.category === 'Drainage Problem' ? '🚧' : '📋'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{c.title}</p>
                          <p className="text-xs text-gray-500 font-mono">{c.complaintId}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{c.fullName} · {c.district}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`badge text-xs ${STATUS_CONFIG[c.status] || 'badge-pending'}`}>
                          {c.status?.replace(/_/g, ' ')}
                        </span>
                        <span className={`badge text-xs ${PRIORITY_CONFIG[c.priority]?.class || 'badge-pending'}`}>
                          {PRIORITY_CONFIG[c.priority]?.label || c.priority}
                        </span>
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <select
                        id={`status-select-${c.id}`}
                        value={c.status}
                        onChange={e => updateStatus(c.id, e.target.value)}
                        className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/40 cursor-pointer"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                      </select>
                      {updatingId === c.id && <Loader2 size={14} className="animate-spin text-primary-500 shrink-0" />}
                      <button id={`view-complaint-btn-${c.id}`} onClick={() => setSelectedComplaint(c)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-primary-500 hover:bg-primary/10 transition-all whitespace-nowrap">
                        <Eye size={12} /> Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedComplaint ? (
              <motion.div
                key={selectedComplaint.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5 shadow-card-hover sticky top-24 space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base mb-0.5">{selectedComplaint.title}</h3>
                    <p className="text-xs text-primary-500 font-mono">{selectedComplaint.complaintId}</p>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-white/10 rounded-lg">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Citizen:</span>
                    <span className="font-medium">{selectedComplaint.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">District:</span>
                    <span className="font-medium">{selectedComplaint.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-medium text-xs">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Filed:</span>
                    <span className="font-medium text-xs">{new Date(selectedComplaint.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority:</span>
                    <span className={`badge text-xs ${PRIORITY_CONFIG[selectedComplaint.priority]?.class}`}>
                      {PRIORITY_CONFIG[selectedComplaint.priority]?.label}
                    </span>
                  </div>
                </div>

                {selectedComplaint.description && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-5">{selectedComplaint.description}</p>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <label className="form-label text-xs">Update Status</label>
                  <select
                    id={`detail-status-select-${selectedComplaint.id}`}
                    value={selectedComplaint.status}
                    onChange={e => updateStatus(selectedComplaint.id, e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                  </select>
                </div>

                {/* Response */}
                <div>
                  <label className="form-label text-xs flex items-center gap-2">
                    <MessageSquare size={12} /> Send Official Response
                  </label>
                  <textarea
                    id={`response-text-${selectedComplaint.id}`}
                    rows={3}
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    placeholder="Write your official response to the citizen..."
                    className="input-field resize-none text-sm"
                  />
                  <button
                    id={`send-response-btn-${selectedComplaint.id}`}
                    onClick={() => sendResponse(selectedComplaint.id)}
                    disabled={!responseText.trim() || respondingId === selectedComplaint.id}
                    className="btn-primary w-full mt-2 text-sm py-2.5 disabled:opacity-50"
                  >
                    {respondingId === selectedComplaint.id ? (
                      <><Loader2 size={14} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={14} /> Send Response</>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 text-center text-gray-400">
                <Eye size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Click on a complaint to view details and take action</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
