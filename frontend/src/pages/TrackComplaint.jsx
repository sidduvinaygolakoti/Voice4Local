import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import StatusTimeline from '../components/StatusTimeline'
import { complaintService } from '../services/complaint'
import { Search, X, MapPin, Calendar, Tag, Hash, ChevronDown } from 'lucide-react'

// Mock data for demo
const MOCK_COMPLAINT = {
  id: 1,
  complaintId: 'LV-2024-0042',
  title: 'Large pothole on main road',
  category: 'Road Issue',
  description: 'There is a massive pothole near the bus stand at Gandhi Road, Warangal. It has caused multiple accidents and two-wheeler riders are at risk every day. The pothole is approximately 2 feet wide and 1 foot deep. Despite several complaints to the local municipality, no action has been taken for the past 3 months.',
  status: 'IN_PROGRESS',
  locationText: 'Gandhi Road near Bus Stand, Warangal',
  latitude: 17.9689,
  longitude: 79.5941,
  imageUrls: [],
  fullName: 'Ramesh Kumar',
  district: 'Warangal',
  state: 'Telangana',
  createdAt: '2024-01-15T10:30:00Z',
  responses: [
    {
      authorityName: 'Municipality Officer',
      message: 'Complaint received and assigned to Road Maintenance Department.',
      createdAt: '2024-01-16T09:00:00Z',
      statusAtTime: 'UNDER_REVIEW',
    },
    {
      authorityName: 'Road Maintenance Dept.',
      message: 'Field inspection completed. Repair work scheduled for this week.',
      createdAt: '2024-01-18T14:00:00Z',
      statusAtTime: 'IN_PROGRESS',
    },
  ],
}

export default function TrackComplaint() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('id') || '')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('id')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) { setError('Please enter a Complaint ID'); return }
    setLoading(true)
    setError('')
    setComplaint(null)
    try {
      const data = await complaintService.track(query.trim())
      setComplaint(data)
    } catch {
      // Demo mode fallback
      if (query.trim().toUpperCase() === 'LV-2024-0042' || query.trim() === MOCK_COMPLAINT.complaintId) {
        setComplaint(MOCK_COMPLAINT)
      } else {
        setError('No complaint found with this ID. Please check and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const categoryEmoji = {
    'Road Issue': '🛣️', 'Drainage Problem': '🚧', 'Electricity Problem': '⚡',
    'Water Supply Problem': '💧', 'Garbage / Waste Problem': '🗑️',
    'Street Lights Not Working': '🔦', 'Government Office Issue': '🏛️',
    'Education / School Problem': '🎓', 'Medical / Health Issue': '🏥', 'Other': '📋',
  }

  const statusLabel = {
    SUBMITTED: { label: 'Submitted', color: 'badge-pending' },
    UNDER_REVIEW: { label: 'Under Review', color: 'badge-inprogress' },
    ASSIGNED: { label: 'Assigned', color: 'badge-inprogress' },
    IN_PROGRESS: { label: 'In Progress', color: 'badge-inprogress' },
    RESOLVED: { label: 'Resolved', color: 'badge-resolved' },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-poppins font-black text-3xl md:text-4xl mb-3">Track Your Complaint</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your Complaint ID (format: LV-2024-XXXX) to see real-time status updates.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass-card p-6 mb-8 shadow-card-hover">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="track-search-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Complaint ID (e.g. LV-2024-0042)"
                className="input-field pl-10 text-base"
              />
              {query && (
                <button onClick={() => { setQuery(''); setComplaint(null); setError('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              id="track-search-btn"
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary px-6 whitespace-nowrap"
            >
              {loading ? (
                <><span className="animate-spin">⌛</span> Searching...</>
              ) : (
                <><Search size={16} /> Track</>
              )}
            </button>
          </div>

          {/* Demo hint */}
          <p className="text-xs text-gray-400 mt-3 text-center">
            💡 Try demo ID: <button id="demo-id-btn" className="text-primary-500 font-mono hover:underline" onClick={() => setQuery('LV-2024-0042')}>LV-2024-0042</button>
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 text-center mb-8 border-red-200 dark:border-red-800"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-red-500 mb-1">Complaint Not Found</p>
            <p className="text-sm text-gray-500">{error}</p>
          </motion.div>
        )}

        {/* Result */}
        {complaint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Complaint Header Card */}
            <div className="glass-card p-6 shadow-card-hover">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-card flex items-center justify-center text-3xl shrink-0">
                    {categoryEmoji[complaint.category] || '📋'}
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-xl mb-1">{complaint.title}</h2>
                    <p className="text-primary-500 font-mono font-semibold text-sm">{complaint.complaintId}</p>
                  </div>
                </div>
                <span className={`${statusLabel[complaint.status]?.color || 'badge-pending'} badge text-sm`}>
                  {statusLabel[complaint.status]?.label || complaint.status}
                </span>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Tag size={12} className="text-primary-400" />
                    {complaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Submitted On</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary-400" />
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin size={12} className="text-primary-400" />
                    <span className="truncate">{complaint.locationText || `${complaint.district}, ${complaint.state}`}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Problem Description</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{complaint.description}</p>
              </div>

              {/* Images */}
              {complaint.imageUrls?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Evidence Photos</p>
                  <div className="flex gap-3 flex-wrap">
                    {complaint.imageUrls.map((url, i) => (
                      <img key={i} src={url} alt={`Evidence ${i+1}`}
                        className="w-24 h-24 rounded-xl object-cover border border-white/20 cursor-pointer hover:scale-105 transition-transform" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="glass-card p-6 shadow-card-hover">
              <h3 className="font-poppins font-bold text-lg mb-6">Status Timeline</h3>
              <StatusTimeline currentStatus={complaint.status} responses={complaint.responses || []} />
            </div>

            {/* Authority Responses */}
            {complaint.responses?.length > 0 && (
              <div className="glass-card p-6 shadow-card-hover">
                <h3 className="font-poppins font-bold text-lg mb-4">
                  Authority Updates ({complaint.responses.length})
                </h3>
                <div className="space-y-4">
                  {complaint.responses.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                        {r.authorityName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{r.authorityName}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(r.createdAt).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{r.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!complaint && !error && !loading && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-semibold text-lg mb-2">Enter your Complaint ID above</p>
            <p className="text-sm">Your Complaint ID was given to you when you submitted the complaint.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
