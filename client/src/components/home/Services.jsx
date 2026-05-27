import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Bug, Zap, Shield, AlertTriangle, Moon, Sparkles, Circle, Crosshair, Home, Building2, ChevronRight } from 'lucide-react'
import { getServices } from '../../utils/api'
import { buildServiceEnquiryUrl, openWhatsApp } from '../../utils/whatsapp'
import { getServiceImage } from '../../constants/stockImages'

const iconMap = {
  Bug, Zap, Shield, AlertTriangle, Moon, Sparkles, Circle, Crosshair, Home, Building2,
  Default: Bug,
}

function ServiceIcon({ name }) {
  const Icon = iconMap[name] || iconMap.Default
  return <Icon className="w-6 h-6" />
}

function ServiceCard({ service, index }) {
  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={getServiceImage(service)}
          alt={`${service.name} service`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/65 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 w-11 h-11 rounded-xl bg-white/90 text-green-600 flex items-center justify-center shadow-lg">
          <ServiceIcon name={service.icon} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-navy-900 text-base mb-2">{service.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5 line-clamp-3">{service.description}</p>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={scrollToBooking}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Book This Service
          </button>
          <button
            onClick={() => openWhatsApp(buildServiceEnquiryUrl(service.name))}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 text-sm font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Enquiry
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-5">
        <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 rounded-lg w-full mb-1.5" />
        <div className="h-3 bg-slate-100 rounded-lg w-5/6 mb-1.5" />
        <div className="h-3 bg-slate-100 rounded-lg w-4/6 mb-6" />
        <div className="h-9 bg-slate-100 rounded-xl mb-2" />
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data.data.services))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">What We Treat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Our Pest Control Services</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Professional treatment for all common pests. Residential and commercial. Available 24/7 across Brakpan and surrounding areas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : services.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)
          }
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-slate-500 text-sm mb-4">Don't see your pest problem listed?</p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
          >
            Contact us for all pest types
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
