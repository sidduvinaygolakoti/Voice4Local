import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  Menu, X, Sun, Moon, Home, FileText, List,
  Bot, Info, LogIn, UserPlus, User, LogOut,
  ChevronDown, Bell
} from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Raise Query', path: '/raise-query', icon: FileText },
  { label: 'My Complaints', path: '/my-complaints', icon: List },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  { label: 'About', path: '/about', icon: Info },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, logout, isAuthority } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setProfileOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-card rounded-none backdrop-blur-xl border-b border-white/10 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">LV</span>
              </div>
              <div>
                <span className="font-poppins font-bold text-lg gradient-text">LOCAL VOICE</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:block">Connecting Citizens</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-primary/10 text-primary-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-primary-500'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
              {isAuthority && (
                <Link
                  to="/authority-dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/authority-dashboard')
                      ? 'bg-trust-500/10 text-trust-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-trust-500/10 hover:text-trust-500'
                  }`}
                >
                  Authority Panel
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/10 transition-all">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      id="profile-dropdown-btn"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium hidden md:block max-w-24 truncate">{user?.name}</span>
                      <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 glass-card shadow-card-hover rounded-xl overflow-hidden"
                        >
                          <div className="p-3 border-b border-white/10">
                            <p className="font-semibold text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          <div className="p-1">
                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-all">
                              <User size={15} /> Profile
                            </Link>
                            <Link to="/my-complaints" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-all">
                              <List size={15} /> My Complaints
                            </Link>
                            <button
                              id="logout-btn"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                              <LogOut size={15} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" id="nav-login-btn" className="btn-secondary py-2 px-4 text-sm">
                    <LogIn size={15} /> Login
                  </Link>
                  <Link to="/register" id="nav-register-btn" className="btn-primary py-2 px-4 text-sm">
                    <UserPlus size={15} /> Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                id="mobile-menu-btn"
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass-card rounded-l-3xl shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold">LV</span>
                  </div>
                  <span className="font-poppins font-bold gradient-text">LOCAL VOICE</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(path)
                        ? 'bg-primary/10 text-primary-500'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/10 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-all">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full justify-center text-sm">
                      <LogIn size={15} /> Login
                    </Link>
                    <Link to="/register" className="btn-primary w-full justify-center text-sm">
                      <UserPlus size={15} /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
