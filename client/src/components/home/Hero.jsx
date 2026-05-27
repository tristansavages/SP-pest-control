import { motion } from 'framer-motion'
import { Phone, MessageCircle, Clock, MapPin, Building2, Zap, Shield } from 'lucide-react'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'
import { stockImages } from '../../constants/stockImages'

const trustItems = [
  { icon: Clock, label: 'Open 24 Hours' },
  { icon: MapPin, label: 'Local Brakpan' },
  { icon: Building2, label: 'Residential & Commercial' },
  { icon: Zap, label: 'Fast Response' },
  { icon: Shield, label: 'Safe Treatments' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Hero() {
  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Background layers */}
      <img
        src={stockImages.hero}
        alt="Pest control technician fogging an outdoor residential area"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900/85 to-navy-950/95" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

          {/* Badge */}
          <motion.div variants={item} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/15 border border-green-500/30 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-semibold tracking-wide">Available 24/7 in Brakpan & Surrounding Areas</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={item}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              Professional Pest Control
              <br />
              <span className="relative inline-block">
                in{' '}
                <span className="text-green-400">Brakpan</span>
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/70">Available 24/7</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p variants={item} className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Fast, safe, and reliable pest control for homes and businesses.
            We eliminate pests quickly and professionally so you have complete peace of mind.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={scrollToBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Book Pest Control
            </button>
            <a
              href="tel:0719495929"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white text-base font-bold rounded-xl transition-all duration-200 hover:bg-white/10"
            >
              <Phone className="w-5 h-5" />
              071 949 5929
            </a>
            <button
              onClick={() => openWhatsApp(DEFAULT_WA_URL)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1da851] text-white text-base font-bold rounded-xl shadow-2xl shadow-[#25D366]/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                <Icon className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  )
}
