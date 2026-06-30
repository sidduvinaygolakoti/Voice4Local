import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth'
import { toast } from 'react-toastify'
import { Eye, EyeOff, UserPlus, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
]

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'CITIZEN',
      })
      setSuccess(true)
      toast.success('Account created successfully! 🎉')
      setTimeout(() => {
        login(response.user, response.token)
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      if (!err.response) {
        // Fallback for demo mode when backend is offline
        setSuccess(true)
        toast.success('Account created successfully! 🎉 (Demo Mode)')
        const mockUser = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          role: 'CITIZEN',
          phone: data.phone,
        }
        setTimeout(() => {
          login(mockUser, 'mock-jwt-token-registered-user')
          navigate('/dashboard')
        }, 1500)
        return
      }
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setError('root', { message: msg })
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-trust-500/10 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-trust-500" />
          </div>
          <h2 className="font-poppins font-bold text-2xl">Account Created!</h2>
          <p className="text-gray-500">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen py-12 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-lg mx-auto">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.05 }}
          className="glass-card p-8 shadow-card-hover"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
              <span className="text-white font-bold text-2xl">LV</span>
            </div>
            <h1 className="font-poppins font-black text-2xl mb-2">Create Your Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Join LOCAL VOICE — Free citizen registration
            </p>
          </div>

          {/* Error */}
          {errors.root && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6"
            >
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="register-form">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input
                id="name"
                type="text"
                className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Your full name"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="form-label">Email Address <span className="text-red-500">*</span></label>
              <input
                id="reg-email"
                type="email"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="phone" className="form-label">Mobile Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">+91</span>
                <input
                  id="phone"
                  type="tel"
                  className={`input-field pl-12 ${errors.phone ? 'border-red-400' : ''}`}
                  placeholder="9876543210"
                  {...register('phone', {
                    required: 'Mobile number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                  })}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="form-label">State</label>
              <select
                id="state"
                className="input-field"
                {...register('state')}
              >
                <option value="">-- Select your state --</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="form-label">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min. 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must contain uppercase, lowercase, and number',
                    },
                  })}
                />
                <button type="button" id="toggle-password" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="form-label">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  className={`input-field pr-12 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Repeat your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                />
                <button type="button" id="toggle-confirm" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded accent-primary-500"
                {...register('terms', { required: 'You must agree to the terms' })}
              />
              <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs -mt-3">{errors.terms.message}</p>}

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" id="goto-login-link" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary-500 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </motion.div>
  )
}
