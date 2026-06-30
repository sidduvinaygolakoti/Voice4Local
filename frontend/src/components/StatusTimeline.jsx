import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Search, Wrench, CheckCheck } from 'lucide-react'

const steps = [
  {
    id: 'SUBMITTED',
    label: 'Submitted',
    description: 'Your complaint has been received',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    ring: 'ring-blue-200 dark:ring-blue-800',
  },
  {
    id: 'UNDER_REVIEW',
    label: 'Reviewed by Authority',
    description: 'Being reviewed by relevant department',
    icon: Search,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
  },
  {
    id: 'ASSIGNED',
    label: 'Assigned to Department',
    description: 'Forwarded to responsible department',
    icon: Clock,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    ring: 'ring-purple-200 dark:ring-purple-800',
  },
  {
    id: 'IN_PROGRESS',
    label: 'Work Started',
    description: 'Field team working on the issue',
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    ring: 'ring-orange-200 dark:ring-orange-800',
  },
  {
    id: 'RESOLVED',
    label: 'Resolved',
    description: 'Issue has been successfully resolved',
    icon: CheckCheck,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    ring: 'ring-green-200 dark:ring-green-800',
  },
]

const statusOrder = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

export default function StatusTimeline({ currentStatus, responses = [] }) {
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex
        const isLast = index === steps.length - 1

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex gap-4 relative"
          >
            {/* Vertical line */}
            {!isLast && (
              <div className={`absolute left-5 top-12 w-0.5 h-8 rounded-full transition-all duration-500 ${
                isDone ? 'bg-trust-400' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}

            {/* Icon circle */}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4 transition-all duration-500 ${
              isDone
                ? 'bg-trust-500 ring-green-200 dark:ring-green-800 shadow-glow-green'
                : isCurrent
                ? `${step.bg} ${step.ring} shadow-md`
                : 'bg-gray-100 dark:bg-gray-800 ring-gray-200 dark:ring-gray-700'
            }`}>
              <Icon
                size={18}
                className={
                  isDone ? 'text-white' :
                  isCurrent ? step.color :
                  'text-gray-400'
                }
              />
            </div>

            {/* Content */}
            <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`font-semibold text-sm transition-colors ${
                  isDone ? 'text-trust-500' :
                  isCurrent ? 'text-gray-900 dark:text-white' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary-500 animate-pulse">
                    Current
                  </span>
                )}
                {isDone && (
                  <CheckCircle2 size={13} className="text-trust-500" />
                )}
              </div>
              <p className={`text-xs ${
                isPending ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.description}
              </p>

              {/* Authority responses for this step */}
              {responses
                .filter(r => r.statusAtTime === step.id)
                .map((response, i) => (
                  <div key={i} className="mt-2 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 text-xs">
                    <p className="font-medium text-primary-500 mb-1">{response.authorityName}</p>
                    <p className="text-gray-600 dark:text-gray-300">{response.message}</p>
                    <p className="text-gray-400 mt-1">{new Date(response.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                ))
              }
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
