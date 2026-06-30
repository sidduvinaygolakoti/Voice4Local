import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, AlertCircle, Trash2, Eye,
  MapPin, Calendar, Tag
} from 'lucide-react'

const statusConfig = {
  SUBMITTED: { label: 'Submitted', class: 'badge-pending', icon: Clock },
  UNDER_REVIEW: { label: 'Under Review', class: 'badge-inprogress', icon: AlertCircle },
  ASSIGNED: { label: 'Assigned', class: 'badge-inprogress', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', class: 'badge-inprogress', icon: AlertCircle },
  RESOLVED: { label: 'Resolved', class: 'badge-resolved', icon: CheckCircle2 },
}

const categoryEmoji = {
  'Road Issue': '🛣️',
  'Drainage Problem': '🚧',
  'Electricity Problem': '⚡',
  'Water Supply Problem': '💧',
  'Garbage / Waste Problem': '🗑️',
  'Street Lights Not Working': '🔦',
  'Government Office Issue': '🏛️',
  'Education / School Problem': '🎓',
  'Medical / Health Issue': '🏥',
  'Other': '📋',
}

export default function ComplaintCard({ complaint, index = 0, onView }) {
  const status = statusConfig[complaint.status] || statusConfig.SUBMITTED
  const StatusIcon = status.icon
  const emoji = categoryEmoji[complaint.category] || '📋'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      layout
      className="glass-card p-5 hover:shadow-card-hover transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-card flex items-center justify-center text-lg">
            {emoji}
          </div>
          <div>
            <p className="font-semibold text-sm group-hover:text-primary-500 transition-colors">
              {complaint.title}
            </p>
            <p className="text-xs text-gray-500 font-mono">{complaint.complaintId}</p>
          </div>
        </div>
        <span className={status.class}>
          <StatusIcon size={11} />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
        {complaint.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Tag size={11} />
          {complaint.category}
        </span>
        {complaint.locationText && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {complaint.locationText}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN') : 'Recently'}
        </span>
      </div>

      {/* Images preview */}
      {complaint.imageUrls?.length > 0 && (
        <div className="flex gap-2 mb-4">
          {complaint.imageUrls.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Evidence ${i + 1}`}
              className="w-14 h-14 rounded-lg object-cover border border-white/20"
            />
          ))}
          {complaint.imageUrls.length > 3 && (
            <div className="w-14 h-14 rounded-lg bg-black/20 border border-white/20 flex items-center justify-center text-xs text-gray-400">
              +{complaint.imageUrls.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <button
          id={`view-complaint-${complaint.complaintId}`}
          onClick={() => onView?.(complaint)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-primary-500 hover:bg-primary/10 transition-all"
        >
          <Eye size={13} /> View Details
        </button>
        <Link
          to={`/track-complaint?id=${complaint.complaintId}`}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-trust-500 hover:bg-trust-500/10 transition-all"
        >
          Track Status
        </Link>
      </div>
    </motion.div>
  )
}
