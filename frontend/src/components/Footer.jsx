import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react'

const footerLinks = {
  platform: [
    { label: 'Raise Complaint', path: '/raise-query' },
    { label: 'Track Status', path: '/track-complaint' },
    { label: 'AI Assistant', path: '/ai-assistant' },
    { label: 'My Dashboard', path: '/dashboard' },
  ],
  resources: [
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Categories', path: '/#categories' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Use', path: '/terms' },
    { label: 'RTI Information', path: '/rti' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 opacity-95" />

      <div className="relative section-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                <span className="text-white font-bold text-lg">LV</span>
              </div>
              <div>
                <span className="font-poppins font-bold text-xl text-white">LOCAL VOICE</span>
                <p className="text-xs text-gray-400">Connecting Citizens. Solving Problems.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A digital bridge between citizens and government authorities — bringing transparency, accountability, and swift resolution to local issues across India.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-5">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-5">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-trust-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-primary-400" />
                </div>
                <span className="text-gray-400 text-sm">Government Secretariat,<br />Hyderabad, Telangana</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary-400" />
                </div>
                <a href="tel:1800-XXX-XXXX" className="text-gray-400 text-sm hover:text-white transition-colors">1800-XXX-XXXX</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-primary-400" />
                </div>
                <a href="mailto:support@localvoice.gov.in" className="text-gray-400 text-sm hover:text-white transition-colors">support@localvoice.gov.in</a>
              </li>
            </ul>

            {/* Digital India badge */}
            <div className="mt-6 p-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">DI</div>
              <div>
                <p className="text-white text-xs font-semibold">Digital India Initiative</p>
                <p className="text-gray-500 text-xs">Govt. Approved Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center">
            © 2024 LOCAL VOICE. Built under <span className="text-primary-400">Digital India</span> initiative. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map(({ label, path }) => (
              <Link key={path} to={path} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
