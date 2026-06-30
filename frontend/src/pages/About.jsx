import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Users, Target, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen py-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow-blue">
            <span className="text-white font-bold text-3xl">LV</span>
          </div>
          <h1 className="font-poppins font-black text-4xl md:text-5xl mb-4">
            About <span className="gradient-text">LOCAL VOICE</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            LOCAL VOICE is a Digital India initiative — a civic technology platform bridging the gap between citizens and government authorities for faster, transparent problem resolution.
          </p>
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Empower every citizen — from villages to cities — to raise their voice and get local problems solved through digital means.', color: 'text-primary-500', bg: 'bg-primary/10' },
            { icon: Users, title: 'Who We Serve', desc: 'Andhra Pradesh and Telangana citizens. Any local resident facing civic issues with roads, water, electricity, drainage, or public services.', color: 'text-trust-500', bg: 'bg-trust-500/10' },
            { icon: Shield, title: 'Our Promise', desc: 'Every complaint gets a unique tracking ID. We ensure accountability — authorities must respond within defined SLA timelines.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="glass-card p-6 text-center">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} className={color} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="glass-card p-8 mb-10">
          <h2 className="font-poppins font-bold text-2xl mb-6">Why LOCAL VOICE?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Report problems in Telugu, Hindi, or English',
              'AI assistant helps identify the right department',
              'Real-time status tracking with Complaint ID',
              'Upload photos as evidence for faster resolution',
              'Direct connection to MLA, MP, Municipality, Panchayat',
              'Accessible on mobile — no app download needed',
              'Free to use for all Indian citizens',
              'Transparent SLA-based accountability system',
            ].map(point => (
              <div key={point} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={15} className="text-trust-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/register" className="btn-primary text-base px-8 py-4">
            Join LOCAL VOICE Today <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
