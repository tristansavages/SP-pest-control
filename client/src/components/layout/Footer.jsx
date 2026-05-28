import { Link } from 'react-router-dom'
import { MessageCircle, Clock, Shield, ChevronRight } from 'lucide-react'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Protection Plans', href: '/protection-plans' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/#about' },
  { label: 'Book Now', href: '/#booking' },
]

const services = [
  'Cockroach Control',
  'Ant Control',
  'Rodent Control',
  'Termite Treatment',
  'Bed Bug Treatment',
  'Commercial Pest Control',
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/sp-pest-control-logo.png"
                  alt="SP Pest Control logo"
                  className="w-[130%] h-[130%] max-w-none object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-base">SP Pest Control</div>
                <div className="text-green-400 text-[10px] uppercase tracking-widest">Professional Pest Control</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Professional residential and commercial pest control services. Protecting homes, businesses, and industries with reliable pest management solutions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => openWhatsApp(DEFAULT_WA_URL)}
                className="flex items-center gap-2 px-3 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-lg text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="text-white/80">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-1 text-white/60 hover:text-green-400 text-sm transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="flex items-center gap-1 text-white/60 hover:text-green-400 text-sm transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <button onClick={() => openWhatsApp(DEFAULT_WA_URL)} className="flex items-start gap-3 group w-full">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="text-left">
                  <div className="text-white/40 text-xs uppercase tracking-wide">WhatsApp</div>
                  <div className="text-white/80 group-hover:text-[#25D366] text-sm transition-colors">Chat on WhatsApp</div>
                </div>
              </button>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Hours</div>
                  <div className="text-green-400 text-sm font-semibold">Available 24/7</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Services</div>
                  <div className="text-white/80 text-sm">Residential &amp; Commercial</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} SP Pest Control. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Professional Residential &amp; Commercial Pest Control
          </p>
        </div>
      </div>
    </footer>
  )
}
