import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth'
import { toast } from 'react-toastify'
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      login(response.user, response.token)
      toast.success(`Welcome back, ${response.user.name}! 👋`)
      navigate(response.user.role === 'AUTHORITY' ? '/authority-dashboard' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      setError('root', { message: msg })
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Demo login helper
  const demoLogin = async (role) => {
    const credentials = role === 'citizen'
      ? { email: 'citizen@demo.com', password: 'Demo@1234' }
      : { email: 'authority@demo.com', password: 'Demo@1234' }
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      login(response.user, response.token)
      toast.success('Demo login successful!')
      navigate(response.user.role === 'AUTHORITY' ? '/authority-dashboard' : '/dashboard')
    } catch {
      // If backend not running, use mock data
      const mockUser = role === 'citizen'
        ? { id: 1, name: 'Demo Citizen', email: 'citizen@demo.com', role: 'CITIZEN', phone: '9876543210' }
        : { id: 2, name: 'Demo Authority', email: 'authority@demo.com', role: 'AUTHORITY', phone: '9876543211' }
      login(mockUser, 'mock-jwt-token-' + role)
      toast.success(`Logged in as ${role} (demo mode)`)
      navigate(role === 'authority' ? '/authority-dashboard' : '/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-trust/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
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
            <h1 className="font-poppins font-black text-2xl mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sign in to your LOCAL VOICE account
            </p>
          </div>

          {/* Error message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or try demo</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Demo buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="demo-citizen-btn"
              onClick={() => demoLogin('citizen')}
              disabled={isLoading}
              className="btn-secondary py-2.5 text-sm"
            >
              👤 Citizen Demo
            </button>
            <button
              id="demo-authority-btn"
              onClick={() => demoLogin('authority')}
              disabled={isLoading}
              className="btn-secondary py-2.5 text-sm border-trust-500 text-trust-500 hover:bg-trust-500/10"
            >
              🏛️ Authority Demo
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New citizen?{' '}
            <Link to="/register" id="goto-register-link" className="text-primary-500 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </motion.div>

        {/* Back to home */}
        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary-500 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </motion.div>
  )
}
