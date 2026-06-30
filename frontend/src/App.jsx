import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages (lazy loaded)
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const RaiseQuery = lazy(() => import('./pages/RaiseQuery'))
const TrackComplaint = lazy(() => import('./pages/TrackComplaint'))
const AIAssistant = lazy(() => import('./pages/AIAssistant'))
const AuthorityDashboard = lazy(() => import('./pages/AuthorityDashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary animate-pulse" />
        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-primary animate-ping opacity-30" />
      </div>
      <p className="text-gray-500 font-noto text-sm animate-pulse">Loading LOCAL VOICE...</p>
    </div>
  </div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />

        {/* Protected: Citizens */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireRole="CITIZEN">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/raise-query" element={
          <ProtectedRoute>
            <RaiseQuery />
          </ProtectedRoute>
        } />
        <Route path="/my-complaints" element={
          <ProtectedRoute requireRole="CITIZEN">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/ai-assistant" element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Protected: Authority */}
        <Route path="/authority-dashboard" element={
          <ProtectedRoute requireRole="AUTHORITY">
            <AuthorityDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            <main className="flex-1 pt-20">
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
