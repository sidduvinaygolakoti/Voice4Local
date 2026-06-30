import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Shield, Zap, Users, CheckCircle2, Star, ChevronDown } from 'lucide-react'

// ─── Animated Background ───
const FloatingIcon = ({ emoji, style, delay = 0 }) => (
  <motion.div
    className="absolute text-2xl opacity-20 pointer-events-none select-none"
    style={style}
    animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
    transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    {emoji}
  </motion.div>
)

// ─── Feature Card with 3D Parallax Tilt Effect ───
const FeatureCard = ({ emoji, title, desc, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    setRotateX(-y / 6) // Tilt sensitivity
    setRotateY(x / 6)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{
          ...(inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }),
          rotateX,
          rotateY
        }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-glow-blue transition-all duration-150"
        style={{
          transformStyle: 'preserve-3d',
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
        }}
        whileHover={{ translateZ: 15 }}
      >
        <div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-trust/20 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ transform: 'translateZ(30px)' }}
        >
          {emoji}
        </div>
        <h3 
          className="font-poppins font-bold text-base mb-2 group-hover:gradient-text transition-all"
          style={{ transform: 'translateZ(20px)' }}
        >
          {title}
        </h3>
        <p 
          className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
          style={{ transform: 'translateZ(10px)' }}
        >
          {desc}
        </p>
      </motion.div>
    </div>
  )
}

const features = [
  { emoji: '🛣️', title: 'Road Problems', desc: 'Potholes, broken roads, missing lane markings' },
  { emoji: '💧', title: 'Water Issues', desc: 'No supply, contamination, pipeline leaks' },
  { emoji: '⚡', title: 'Electricity', desc: 'Power cuts, dangling wires, no street lights' },
  { emoji: '🚧', title: 'Drainage Issues', desc: 'Overflowing drains, flooding, blocked sewers' },
  { emoji: '🔦', title: 'Street Lights', desc: 'Non-working lights, dark roads at night' },
  { emoji: '🗑️', title: 'Garbage', desc: 'Uncollected waste, illegal dumping grounds' },
  { emoji: '🏥', title: 'Medical Facilities', desc: 'PHC issues, no doctors, medicine shortage' },
  { emoji: '🏛️', title: 'Public Services', desc: 'Government office delays, document issues' },
]

const steps = [
  {
    step: '01',
    title: 'Register as Citizen',
    desc: 'Create your account with your mobile number, email and basic details. Free and instant.',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    step: '02',
    title: 'Raise Your Complaint',
    desc: 'Describe your problem in Telugu, Hindi or English. Upload photos as evidence. Drop a pin on the map.',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
  },
  {
    step: '03',
    title: 'Track Until Resolved',
    desc: 'Get your unique Complaint ID. Track real-time status updates. Get notified when resolved.',
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600',
  },
]

const testimonials = [
  {
    name: 'Ramesh Kumar',
    location: 'Nellore, AP',
    text: '"My street had a massive pothole for months. I raised a complaint on LOCAL VOICE on Monday — by Friday the municipality fixed it! Incredible."',
    stars: 5,
    avatar: 'R',
    bg: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Lakshmi Devi',
    location: 'Karimnagar, TG',
    text: '"Water supply was erratic for 2 weeks. I described the problem in Telugu using the AI assistant and it helped me file a proper complaint. Issue resolved in 4 days."',
    stars: 5,
    avatar: 'L',
    bg: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Suresh Babu',
    location: 'Vijayawada, AP',
    text: '"The tracking system is amazing. I could see exactly which department my complaint was with. Very transparent government portal."',
    stars: 5,
    avatar: 'S',
    bg: 'from-green-500 to-green-600',
  },
]

// ─── Stats ───
const stats = [
  { value: '1,24,500+', label: 'Complaints Resolved' },
  { value: '98 Districts', label: 'Coverage Across AP & TG' },
  { value: '4.2 Days', label: 'Avg. Resolution Time' },
  { value: '2,40,000+', label: 'Registered Citizens' },
]

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export default function Home() {
  const howItWorksRef = useRef(null)

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="page-wrapper"
    >
      {/* ─── HERO ─── */}
      <section className="hero-bg min-h-[calc(100vh-80px)] flex items-center relative overflow-hidden">
        {/* Animated particles / floating icons */}
        <FloatingIcon emoji="🛣️" style={{ top: '15%', left: '5%' }} delay={0} />
        <FloatingIcon emoji="💧" style={{ top: '25%', right: '8%' }} delay={1} />
        <FloatingIcon emoji="⚡" style={{ bottom: '30%', left: '8%' }} delay={2} />
        <FloatingIcon emoji="🏛️" style={{ top: '60%', right: '5%' }} delay={0.5} />
        <FloatingIcon emoji="🌳" style={{ top: '10%', right: '20%' }} delay={1.5} />
        <FloatingIcon emoji="🏘️" style={{ bottom: '20%', left: '20%' }} delay={3} />
        <FloatingIcon emoji="🚰" style={{ top: '40%', left: '15%' }} delay={2.5} />
        <FloatingIcon emoji="🏥" style={{ bottom: '15%', right: '15%' }} delay={1} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-green-600/20 blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 py-10 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <motion.div 
              className="lg:col-span-7 text-center lg:text-left"
              variants={{
                initial: {},
                animate: { transition: { staggerChildren: 0.12 } }
              }}
              initial="initial"
              animate="animate"
            >
              {/* Badge */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8"
              >
                <Shield size={14} className="text-green-400" />
                Official Digital India Citizen Portal
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={{
                  initial: { opacity: 0, y: 25 },
                  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } }
                }}
                className="font-poppins text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6"
              >
                Your Voice.{' '}
                <span className="block">
                  Your{' '}
                  <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-400">
                      Problem.
                    </span>
                  </span>
                </span>
                Your Solution.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={{
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } }
                }}
                className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
              >
                Raise your local issues directly to responsible authorities —{' '}
                <strong className="text-white">MLA, MP, Panchayat, Municipality</strong> —
                and track until it's solved. Available in Telugu, Hindi & English.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 15 },
                  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } }
                }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
              >
                <Link
                  to="/dashboard"
                  id="hero-enter-portal-btn"
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary-600 font-bold text-lg shadow-2xl hover:shadow-white/25 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1"
                >
                  Enter Portal
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/raise-query"
                  id="hero-raise-complaint-btn"
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/70 transition-all duration-300 hover:-translate-y-1"
                >
                  Raise a Complaint
                </Link>
                <Link
                  to="/track-complaint"
                  id="hero-track-btn"
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-trust-500/50 text-trust-300 font-bold text-lg backdrop-blur-sm hover:bg-trust-500/10 hover:border-trust-500/80 transition-all duration-300 hover:-translate-y-1"
                >
                  Track My Complaint
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive Code-based Glassmorphic Mockup */}
            <motion.div
              className="lg:col-span-5 hidden lg:flex justify-center relative min-h-[480px]"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.2 }}
            >
              {/* Central floating area with cards */}
              <div className="relative w-full max-w-[420px] flex items-center justify-center font-noto">
                
                {/* 1. Decorative glow orbs in the background */}
                <div className="absolute w-72 h-72 rounded-full bg-primary-500/10 blur-3xl -top-10 -left-10" />
                <div className="absolute w-72 h-72 rounded-full bg-trust-500/10 blur-3xl -bottom-10 -right-10" />

                {/* 2. Mock Radar Map (Background Layer) */}
                <motion.div 
                  className="absolute top-0 right-4 glass-card p-4 mock-glow-indigo w-56 h-56 flex flex-col items-center justify-center border border-white/10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="relative w-36 h-36 border border-white/5 dark:border-white/10 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border border-dashed border-primary-500/20 rounded-full animate-spin [animation-duration:20s]" />
                    <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-trust-400 animate-ping" />
                        <div className="w-2 h-2 rounded-full bg-trust-500 absolute" />
                      </div>
                    </div>
                    {/* Concentric pulsing rings */}
                    <div className="absolute w-24 h-24 rounded-full border border-trust-500/30 radar-ring" />
                    <div className="absolute w-36 h-36 rounded-full border border-primary-500/30 radar-ring [animation-delay:1.5s]" />

                    {/* Animated target dots */}
                    <span className="absolute top-8 left-8 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="absolute bottom-10 right-8 w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    <span className="absolute top-12 right-12 w-2 h-2 rounded-full bg-trust-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-mono">📡 Scanning active local issues</p>
                </motion.div>

                {/* 3. Live Stats (Top Left Layer) */}
                <motion.div 
                  className="absolute top-12 -left-4 glass-card p-5 mock-glow-teal z-20 w-48 border border-white/10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-trust-500 dark:text-trust-400 font-semibold uppercase tracking-wider">Metrics</span>
                    <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse" />
                  </div>
                  <p className="font-poppins font-black text-3xl text-trust-500">98.7%</p>
                  <p className="font-semibold text-xs mt-1">Problems Solved</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Avg resolution: 4.2 Days</p>
                </motion.div>

                {/* 4. Timeline Progress (Bottom Center Layer) */}
                <motion.div 
                  className="absolute -bottom-6 left-0 right-0 mx-auto glass-card p-5 mock-glow-indigo z-30 w-[360px] border border-white/10"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <p className="font-poppins font-bold text-xs mb-3 text-gray-500">Complaint tracking #LV-2024-0042</p>
                  <div className="flex items-center justify-between relative px-2">
                    <div className="absolute left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-3.5 z-0" />
                    
                    <div className="flex flex-col items-center gap-1 z-10">
                      <span className="w-7 h-7 rounded-full bg-trust-500 flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                      <span className="text-[10px] font-semibold">Submitted</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="relative w-7 h-7">
                        <span className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-primary-500 flex items-center justify-center text-[10px] text-white font-bold">●</span>
                      </div>
                      <span className="text-[10px] font-semibold text-primary-500">In Progress</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 opacity-40 z-10">
                      <span className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">3</span>
                      <span className="text-[10px] font-semibold">Resolved</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>

          {/* Scroll indicator (Centered at bottom of hero section) */}
          <motion.button
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { delay: 0.8, duration: 0.5 } }
            }}
            initial="initial"
            animate="animate"
            onClick={scrollToHowItWorks}
            className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors mx-auto mt-12"
          >
            <span className="text-xs">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-12 border-b border-white/10" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-poppins font-black text-2xl sm:text-3xl gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="categories" className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-widest mb-3 block">Problem Categories</span>
            <h2 className="section-title">What Issues Can You Report?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From road potholes to water supply failures — every local problem deserves a local solution.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" ref={howItWorksRef} className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-trust-500 uppercase tracking-widest mb-3 block">Simple Process</span>
            <h2 className="section-title">How LOCAL VOICE Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Three simple steps to make your voice heard by the right authorities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-primary opacity-30" />

            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-6`}>
                    <Icon size={32} className="text-white" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-md">
                      <span className="font-poppins font-black text-xs text-gray-700 dark:text-gray-200">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="font-poppins font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link to="/register" id="get-started-btn" className="btn-primary text-base px-8 py-4">
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── AI ASSISTANT PROMO ─── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-trust/5" />
        <div className="section-container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-widest mb-3 block">AI-Powered</span>
              <h2 className="font-poppins font-black text-4xl md:text-5xl mb-6 leading-tight">
                Meet Your
                <span className="block gradient-text">LOCAL HELP AI</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Can't figure out which department to contact? Describe your problem in Telugu, Hindi, or English.
                Our AI will identify the issue, suggest the right authority, and even help write your formal complaint.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Understands Telugu, Hindi, and English',
                  'Identifies the right government department',
                  'Helps write formal complaint descriptions',
                  'Estimates resolution timeline',
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-trust-500 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
              <Link to="/ai-assistant" id="try-ai-btn" className="btn-primary inline-flex">
                Try AI Assistant <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Chat preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6 shadow-card-hover"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <p className="font-bold text-sm">LOCAL HELP AI</p>
                  <p className="text-xs text-trust-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-trust-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="chat-bubble-user">
                    నా వీధిలో వెలుతురు రావడం లేదు
                  </div>
                </div>
                {/* AI response */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="chat-bubble-ai">
                    <p className="font-semibold text-primary-500 text-xs mb-1">Street Light / Electricity Issue</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      This appears to be a <strong>street light problem</strong> under
                      <strong> Municipality / Electricity Board</strong>.
                    </p>
                    <p className="text-xs text-gray-500">Would you like me to help write a formal complaint? I can do it in Telugu or English. 📝</p>
                  </div>
                </div>
                {/* Typing indicator */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex gap-1">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} />
                  </div>
                  AI is typing...
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-widest mb-3 block">Success Stories</span>
            <h2 className="section-title">Citizens Who Got Results</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center text-white font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-green-500/30 blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-black text-4xl md:text-5xl text-white mb-6">
              Ready to Make Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-400">
                Voice Heard?
              </span>
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Join 2,40,000+ citizens who are already using LOCAL VOICE to solve local problems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" id="cta-register-btn" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary-600 font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all hover:-translate-y-1">
                Register Now — Free <ArrowRight size={18} />
              </Link>
              <Link to="/track-complaint" id="cta-track-btn" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 hover:border-white/70 transition-all hover:-translate-y-1">
                Track Existing Complaint
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
