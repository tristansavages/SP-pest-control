import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle, Menu, X } from 'lucide-react'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'

const navLinks = [
  { label: 'Home', href: '/', type: 'page' },
  { label: 'Residential', href: '/residential', type: 'page' },
  { label: 'Commercial', href: '/commercial', type: 'page' },
  { label: 'Services', href: '/services', type: 'page' },
  { label: 'Plans', href: '/protection-plans', type: 'page' },
  { label: 'Industries', href: '/industries', type: 'page' },
  { label: 'About', href: '#about', type: 'scroll' },
  { label: 'Contact', href: '#contact', type: 'scroll' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate('/')
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)
  }

  const handleNavClick = (link) => {
    setMenuOpen(false)
    if (link.href === '/') {
      goHome()
      return
    }
    if (link.type === 'page') {
      navigate(link.href)
    } else {
      // scroll link
      const id = link.href.replace('#', '')
      if (location.pathname === '/') {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/' + link.href)
      }
    }
  }

  const handleBookClick = () => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById('booking')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#booking')
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <button type="button" onClick={goHome} className="flex items-center gap-2.5 group text-left">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/sp-pest-control-logo.png"
                alt="SP Pest Control logo"
                className="w-[130%] h-[130%] max-w-none object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-base tracking-tight">SP Pest Control</div>
              <div className="text-green-400 text-[10px] font-medium uppercase tracking-widest">Professional Pest Control</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className="px-3 py-2 text-white/80 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => openWhatsApp(DEFAULT_WA_URL)}
              className="flex items-center gap-2 px-4 py-2 text-[#25D366] border border-[#25D366]/50 hover:border-[#25D366] hover:bg-[#25D366]/10 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </button>
            <button
              onClick={handleBookClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
            >
              Book a Service
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-navy-900 border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => { openWhatsApp(DEFAULT_WA_URL); setMenuOpen(false) }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </button>
              <button
                onClick={handleBookClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Book a Service
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
