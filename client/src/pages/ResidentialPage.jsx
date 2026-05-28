import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, MessageCircle, Shield, TrendingDown, Award, Clock } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import BookingForm from '../components/home/BookingForm'
import { getServices, getPlans } from '../utils/api'
import { buildServiceEnquiryUrl, openWhatsApp, DEFAULT_WA_URL } from '../utils/whatsapp'
import { getServiceImage } from '../constants/stockImages'

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const cockroachBenefits = [
  { Icon: Shield, title: 'Colony Elimination', text: 'Gel treatments are carried back to the nest, eliminating the colony at source rather than just killing individual insects.' },
  { Icon: TrendingDown, title: 'No Scattering', text: 'Unlike sprays and fumigation, professional gel treatments do not cause cockroaches to scatter into walls or neighbouring areas.' },
  { Icon: Award, title: 'Professional-Grade', text: 'We use professional formulations that are not available over the counter, ensuring far more effective results.' },
  { Icon: Clock, title: 'Long-Lasting', text: 'Our treatments are designed to provide lasting protection, not just a short-term knock-down of visible insects.' },
]

const fallbackPlans = [
  { id: 1, name: 'RatGuard Monthly', slug: 'ratguard-monthly', tagline: 'Proactive rat protection for your home', monthly_price: 260 },
  { id: 2, name: 'RoachGuard 360', slug: 'roachguard-360', tagline: 'Year-round cockroach protection', monthly_price: 120 },
  { id: 3, name: 'AntArmor 365', slug: 'antarmor-365', tagline: 'Year-round ant barrier protection', monthly_price: 156 },
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

export default function ResidentialPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [plans, setPlans] = useState(fallbackPlans)

  useEffect(() => {
    document.title = 'Residential Pest Control | SP Pest Control'
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

  useEffect(() => {
    getPlans()
      .then((res) => {
        const data = res.data?.data?.plans || res.data?.plans || res.data || []
        if (Array.isArray(data) && data.length > 0) setPlans(data)
      })
      .catch(() => {})
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
            <span className="text-white/70">Residential</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Residential Pest Control</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Professional Home Pest Control
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Pests in your home are more than an inconvenience. SP Pest Control offers professional home pest control solutions designed to treat active infestations and help protect your home long-term.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToBooking}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 hover:-translate-y-0.5"
              >
                Book a Service
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
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Home Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Residential Pest Control Services</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Professional treatment for all common household pests. Fast, effective, and safe for your home.
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

      {/* Cockroach Feature Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
                <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Cockroach Control</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-5">Cockroach Control</h2>
              <p className="text-slate-500 text-base leading-relaxed mb-4">
                Cockroach control is essential because cockroaches can carry diseases such as salmonella. Infestations should be treated as soon as they are noticed. A professional pest control expert can use specially designed gel formulations and targeted treatment methods to deal with the problem effectively.
              </p>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Customers should avoid relying only on sprays or fumigation for cockroaches, as this can cause them to spread deeper into walls or move into neighbouring areas. Professional gel treatments work differently — they are carried back to the nest, helping to eliminate the colony at the source.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={scrollToBooking}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/20 hover:-translate-y-0.5"
                >
                  Book Cockroach Treatment
                </button>
                <button
                  onClick={() => openWhatsApp(buildServiceEnquiryUrl('Cockroach Control'))}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 font-semibold rounded-xl transition-all"
                >
                  <WhatsAppIcon />
                  Ask on WhatsApp
                </button>
              </div>
            </motion.div>

            {/* Right: Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {cockroachBenefits.map(({ Icon, title, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="bg-slate-50 rounded-2xl border border-slate-100 p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Protection Plans Teaser */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Protection Plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Protect Your Home Year-Round</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Once-off treatments solve today's problem. Our protection plans help prevent tomorrow's.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {plans.slice(0, 3).map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6"
              >
                <h3 className="font-black text-navy-900 text-base mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.tagline}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-2xl font-black text-navy-900">R{plan.monthly_price}</span>
                  <span className="text-slate-400 text-sm mb-0.5">/mo</span>
                </div>
                <Link
                  to="/protection-plans"
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-semibold transition-colors"
                >
                  View Plan
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/protection-plans"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/20 hover:-translate-y-0.5"
            >
              View All Protection Plans
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Booking */}
      <BookingForm />

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
