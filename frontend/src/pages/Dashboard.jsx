import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ComplaintCard from '../components/ComplaintCard'
import {
  FileText, Clock, Loader2, CheckCircle2, Plus, Search,
  BarChart3, TrendingUp, Bell
} from 'lucide-react'
import { complaintService } from '../services/complaint'
import { toast } from 'react-toastify'

// Mock complaints for demo mode
const MOCK_COMPLAINTS = [
  {
    id: 1,
    complaintId: 'LV-2024-0042',
    title: 'Large pothole on main road',
    category: 'Road Issue',
    description: 'There is a massive pothole near the bus stand that has caused multiple accidents. It needs immediate repair.',
    status: 'IN_PROGRESS',
    locationText: 'Main Road, Warangal',
    imageUrls: [],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    complaintId: 'LV-2024-0071',
    title: 'No water supply for 3 days',
    category: 'Water Supply Problem',
    description: 'Our area has not received water supply for the past 3 days. Pipeline seems broken.',
    status: 'RESOLVED',
    locationText: 'Gandhi Nagar Colony',
    imageUrls: [],
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 3,
    complaintId: 'LV-2024-0089',
    title: 'Garbage not collected in a week',
    category: 'Garbage / Waste Problem',
    description: 'Municipal garbage truck has not visited our street for over a week. Waste is piling up.',
    status: 'SUBMITTED',
    locationText: 'Ambedkar Nagar',
    imageUrls: [],
    createdAt: '2024-01-18T16:00:00Z',
  },
]

const StatCard = ({ icon: Icon, value, label, color, bg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="stat-card"
  >
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-3`}>
      <Icon size={22} className={color} />
    </div>
    <p className={`text-3xl font-black font-poppins ${color}`}>{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </motion.div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const data = await complaintService.getMy()
      setComplaints(data)
    } catch {
      // Use mock data when backend is not running
      setComplaints(MOCK_COMPLAINTS)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'SUBMITTED').length,
    inProgress: complaints.filter(c => ['UNDER_REVIEW','ASSIGNED','IN_PROGRESS'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  }

  const filtered = complaints.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen py-8"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 bg-gradient-to-r from-primary/10 to-trust/10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-poppins font-black text-2xl md:text-3xl mb-1">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl glass-card hover:shadow-md transition-all">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/raise-query" id="dashboard-raise-btn" className="btn-primary">
                <Plus size={18} /> Raise Complaint
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={FileText} value={stats.total} label="Total Complaints" color="text-primary-500" bg="bg-primary/10" index={0} />
          <StatCard icon={Clock} value={stats.pending} label="Pending" color="text-yellow-500" bg="bg-yellow-50 dark:bg-yellow-900/20" index={1} />
          <StatCard icon={TrendingUp} value={stats.inProgress} label="In Progress" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" index={2} />
          <StatCard icon={CheckCircle2} value={stats.resolved} label="Resolved" color="text-trust-500" bg="bg-trust-500/10" index={3} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <Link to="/raise-query" id="quick-raise-btn" className="glass-card p-5 flex items-center gap-4 hover:shadow-glow-blue transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={22} className="text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">Raise Complaint</p>
              <p className="text-xs text-gray-500">Report a local problem</p>
            </div>
          </Link>
          <Link to="/track-complaint" id="quick-track-btn" className="glass-card p-5 flex items-center gap-4 hover:shadow-glow-green transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-trust-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search size={22} className="text-trust-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">Track Complaint</p>
              <p className="text-xs text-gray-500">Check status by ID</p>
            </div>
          </Link>
          <Link to="/ai-assistant" id="quick-ai-btn" className="glass-card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 size={22} className="text-purple-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Assistant</p>
              <p className="text-xs text-gray-500">Get help from LOCAL AI</p>
            </div>
          </Link>
        </motion.div>

        {/* Complaints Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-poppins font-bold text-xl">My Complaints</h2>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="complaints-search"
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card p-5 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 skeleton rounded-lg w-3/4" />
                      <div className="h-3 skeleton rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 skeleton rounded-lg" />
                  <div className="h-3 skeleton rounded-lg w-4/5" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-16 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-lg mb-2">
                {search ? 'No matching complaints' : 'No complaints yet'}
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                {search
                  ? 'Try a different search term'
                  : 'You haven\'t raised any complaints yet. Start by reporting a local problem.'}
              </p>
              {!search && (
                <Link to="/raise-query" id="empty-raise-btn" className="btn-primary text-sm">
                  <Plus size={16} /> Raise Your First Complaint
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <ComplaintCard key={c.id} complaint={c} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
