import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, MessageCircle, EyeOff, FileText, Calendar, Layers } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import BookingForm from '../components/home/BookingForm'
import Industries from '../components/home/Industries'
import { getServices } from '../utils/api'
import { buildServiceEnquiryUrl, openWhatsApp, DEFAULT_WA_URL } from '../utils/whatsapp'
import { getServiceImage } from '../constants/stockImages'

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const whyChooseCards = [
  {
    Icon: EyeOff,
    title: 'Discreet Service',
    text: 'We operate professionally and discreetly to minimise disruption to your staff and customers.',
  },
  {
    Icon: FileText,
    title: 'Compliance Documentation',
    text: 'We provide documented reporting after each service to support regulatory and compliance requirements.',
  },
  {
    Icon: Calendar,
    title: 'Flexible Scheduling',
    text: 'We work around your business hours, including early morning, after hours, and weekend appointments.',
  },
  {
    Icon: Layers,
    title: 'Custom Programmes',
    text: 'We tailor our pest management programmes to your specific property, industry, and risk profile.',
  },
]

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

function SkeletonServiceCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-5">
        <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 rounded-lg w-full mb-1.5" />
        <div className="h-3 bg-slate-100 rounded-lg w-5/6 mb-6" />
        <div className="h-9 bg-slate-100 rounded-xl mb-2" />
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )
}

export default function CommercialPage() {
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    document.title = 'Commercial Pest Control | SP Pest Control'
  }, [])

  useEffect(() => {
    getServices()
      .then((res) => {
        const data = res.data?.data?.services || res.data?.services || res.data || []
        setServices(Array.isArray(data) ? data : [])
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false))
  }, [])

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative bg-navy-900 pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto container-padding">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Commercial</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Commercial Pest Control</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Reliable Commercial Pest Control Services That Work
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              SP Pest Control helps businesses protect their premises, customers, employees, reputation, and compliance standards with professional pest management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToBooking}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5"
              >
                Request Commercial Service
              </button>
              <button
                onClick={() => openWhatsApp(DEFAULT_WA_URL)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-semibold rounded-xl transition-all"
              >
                <WhatsAppIcon />
                WhatsApp Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Commercial Pest Control Services</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Professional pest management for businesses, properties, and commercial facilities across Brakpan and surrounding areas.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loadingServices
              ? [...Array(6)].map((_, i) => <SkeletonServiceCard key={i} />)
              : services.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <Industries />

      {/* Why Choose SP */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
              Why Businesses Choose SP Pest Control
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We understand the unique requirements that commercial pest control demands. Here is what sets us apart.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseCards.map(({ Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:border-green-200 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy-900 text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Enquiry heading before booking form */}
      <section className="pt-12 bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Get a Quote</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
              Request a Commercial Pest Control Plan
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Booking */}
      <BookingForm />

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
