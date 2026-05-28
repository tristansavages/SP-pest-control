import { motion } from 'framer-motion'
import { CheckCircle, Building2, Tag, BookOpen, Layers } from 'lucide-react'
import { openWhatsApp, DEFAULT_WA_URL } from '../../utils/whatsapp'

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const commercialServices = [
  'General Pest Control',
  'Rodent Control',
  'Fly Control & Drain Services',
  'Bed Bug Treatments',
  'Cockroach Control',
  'Ant Control',
  'Termite Control',
  'Bird & Pigeon Proofing',
]

const featureCards = [
  {
    Icon: Building2,
    title: 'Restaurants & Food Services',
    text: 'Food safety compliance and pest prevention for commercial kitchens, cafeterias, and dining facilities.',
  },
  {
    Icon: Tag,
    title: 'Retail Businesses',
    text: 'Discreet, effective pest management that protects your store without disrupting operations.',
  },
  {
    Icon: BookOpen,
    title: 'Schools & Campuses',
    text: 'Safe, low-disruption pest control designed for educational environments and student accommodation.',
  },
  {
    Icon: Layers,
    title: 'Multi-Family Properties',
    text: 'Property-wide pest management programmes for apartments, town homes, and shared living spaces.',
  },
]

export default function CommercialSection() {
  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="commercial" className="section-padding bg-navy-900">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Commercial Pest Control</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Reliable Commercial Pest Control Services That Work
            </h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              You have put everything into your business — time, energy, and passion. SP Pest Control helps businesses protect their premises, customers, employees, reputation, and compliance standards with professional pest management services.
            </p>
            <p className="text-white/60 text-base mb-8 leading-relaxed">
              From restaurants to warehouses and retail spaces, we help businesses stay ahead of pest issues with practical, effective pest management solutions.
            </p>

            <ul className="space-y-3 mb-10">
              {commercialServices.map((service, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-3 text-white/80 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {service}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToBooking}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5"
              >
                Request Commercial Pest Control
              </button>
              <button
                onClick={() => openWhatsApp(DEFAULT_WA_URL)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-green-400/50 hover:border-green-400 hover:bg-green-400/10 text-green-400 font-semibold rounded-xl transition-all"
              >
                <WhatsAppIcon />
                WhatsApp SP Pest Control
              </button>
            </div>
          </motion.div>

          {/* Right Column — 2x2 feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {featureCards.map(({ Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-white/10 rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
