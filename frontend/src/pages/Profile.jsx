import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Mail, Phone, MapPin, Shield, Edit2, Save, X, Camera } from 'lucide-react'

export default function Profile() {
  const { user, login, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    state: user?.state || '',
  })

  const handleSave = async () => {
    try {
      login({ ...user, ...formData }, token)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-container max-w-2xl">
        <h1 className="font-poppins font-black text-3xl mb-8">My Profile</h1>

        <div className="glass-card p-8 shadow-card-hover">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-4xl shadow-glow-blue">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera size={14} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`badge mt-2 ${user?.role === 'AUTHORITY' ? 'badge-inprogress' : 'badge-resolved'}`}>
                <Shield size={11} /> {user?.role}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            {[
              { id: 'profile-name', label: 'Full Name', field: 'name', icon: User, type: 'text' },
              { id: 'profile-email', label: 'Email Address', field: 'email', icon: Mail, type: 'email' },
              { id: 'profile-phone', label: 'Mobile Number', field: 'phone', icon: Phone, type: 'tel' },
              { id: 'profile-state', label: 'State', field: 'state', icon: MapPin, type: 'text' },
            ].map(({ id, label, field, icon: Icon, type }) => (
              <div key={field}>
                <label htmlFor={id} className="form-label flex items-center gap-2">
                  <Icon size={14} className="text-primary-400" /> {label}
                </label>
                {editing ? (
                  <input id={id} type={type} value={formData[field]}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                    className="input-field" />
                ) : (
                  <div className="px-4 py-3 rounded-xl border bg-white/5 border-white/10 text-sm">
                    {formData[field] || <span className="text-gray-400 italic">Not provided</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {editing ? (
              <>
                <button id="save-profile-btn" onClick={handleSave} className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
                <button id="cancel-edit-btn" onClick={() => setEditing(false)} className="btn-secondary px-5">
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button id="edit-profile-btn" onClick={() => setEditing(true)} className="btn-primary flex-1">
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
