import { Phone, MessageCircle, MapPin, Clock, Shield, ChevronRight } from 'lucide-react'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'

const quickLinks = ['Home', 'Services', 'About', 'FAQ', 'Contact', 'Book Now']
const services = ['Cockroach Control', 'Rodent & Rat Control', 'Termite Treatment', 'Bed Bug Treatment', 'General Pest Control', 'Commercial Pest Control']

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-base">SP Pest Control</div>
                <div className="text-green-400 text-[10px] uppercase tracking-widest">Brakpan</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Professional pest control services in Brakpan and surrounding areas. Available 24 hours for all pest problems.
            </p>
            <div className="flex gap-3">
              <a
                href="tel:0719495929"
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-white/80">Call</span>
              </a>
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
                <li key={link}>
                  <button
                    onClick={() => scrollTo(`#${link.toLowerCase().replace(' ', '-')}`)}
                    className="flex items-center gap-1 text-white/60 hover:text-green-400 text-sm transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    {link}
                  </button>
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
                  <button
                    onClick={() => scrollTo('#services')}
                    className="flex items-center gap-1 text-white/60 hover:text-green-400 text-sm transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:0719495929" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Phone</div>
                  <div className="text-white/80 group-hover:text-green-400 text-sm transition-colors">071 949 5929</div>
                </div>
              </a>
              <button onClick={() => openWhatsApp(DEFAULT_WA_URL)} className="flex items-start gap-3 group w-full">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="text-left">
                  <div className="text-white/40 text-xs uppercase tracking-wide">WhatsApp</div>
                  <div className="text-white/80 group-hover:text-[#25D366] text-sm transition-colors">071 949 5929</div>
                </div>
              </button>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Address</div>
                  <div className="text-white/80 text-sm">7527 Jumba Street, Brakpan, 1520</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Hours</div>
                  <div className="text-green-400 text-sm font-semibold">Open 24 Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Sp Pest Control. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            7527 Jumba Street, Brakpan, 1520 · Pest Control Services
          </p>
        </div>
      </div>
    </footer>
  )
}
