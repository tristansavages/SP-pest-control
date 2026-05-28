import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Building2, Coffee, Tag, BookOpen } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import BookingForm from '../components/home/BookingForm'
import { getIndustries } from '../utils/api'
import { buildIndustryEnquiryUrl, openWhatsApp } from '../utils/whatsapp'

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const iconMap = { Building2, Coffee, Tag, BookOpen, Default: Building2 }

const fallbackIndustries = [
  {
    id: 1,
    name: 'Multi-Family Housing',
    slug: 'multi-family-housing',
    description:
      'In multi-unit properties like apartments and town home communities, a pest problem in one unit can quickly spread to neighbouring units. SP Pest Control helps property managers stay ahead of pest issues with reliable service, fast response times, and proactive communication.\n\nWe provide custom plans based on property layout, traffic, and specific needs. Our technicians work discreetly to minimise disruption to residents.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Building2',
  },
  {
    id: 2,
    name: 'Restaurants & Food Services',
    slug: 'restaurants-food-services',
    description:
      'In food service, reputation is everything. Whether it is a fast-casual franchise, fine dining restaurant, cafeteria, or commercial kitchen, keeping pests out is essential for food safety, compliance, and customer trust.\n\nSP Pest Control helps food businesses implement proactive pest prevention programmes across commercial kitchens, storage areas, food prep zones, and dining areas.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Coffee',
  },
  {
    id: 3,
    name: 'Retail Businesses',
    slug: 'retail-businesses',
    description:
      'In retail, first impressions matter. Customers expect a clean, safe, and inviting environment. SP Pest Control offers discreet, effective pest management services that help protect your store, your brand, and your bottom line.\n\nWe offer flexible solutions that work around business hours, minimise disruption, and address the specific pest risks of high foot traffic, open doors, break rooms, and storerooms.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Tag',
  },
  {
    id: 4,
    name: 'Schools & Educational Facilities',
    slug: 'schools-educational-facilities',
    description:
      'In schools, learning should be the only thing that is buzzing. SP Pest Control provides pest control solutions designed to be effective, discreet, and suitable for sensitive educational environments including preschools, public schools, private campuses, colleges, and student accommodation.\n\nOur service plans are tailored to protect students, staff, and facilities with minimal disruption to the school day.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'BookOpen',
  },
]

function IndustryIcon({ name }) {
  const Icon = iconMap[name] || iconMap.Default
  return <Icon className="w-6 h-6" />
}

function IndustryCard({ industry, index }) {
  let pests = []
  try {
    pests = typeof industry.common_pests === 'string' ? JSON.parse(industry.common_pests) : industry.common_pests || []
  } catch {
    pests = []
  }

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  const paragraphs = industry.description ? industry.description.split('\n\n') : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-7 flex flex-col"
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-13 h-13 w-[52px] h-[52px] rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
          <IndustryIcon name={industry.icon} />
        </div>
        <h3 className="font-black text-navy-900 text-lg">{industry.name}</h3>
      </div>

      <div className="flex-1 space-y-4 mb-5">
        {paragraphs.length > 0
          ? paragraphs.map((p, i) => (
              <p key={i} className="text-slate-500 text-sm leading-relaxed">
                {p}
              </p>
            ))
          : <p className="text-slate-500 text-sm leading-relaxed">{industry.description}</p>
        }
      </div>

      {pests.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Common Pests</p>
          <div className="flex flex-wrap gap-1.5">
            {pests.map((pest, i) => (
              <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                {pest}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
        <button
          onClick={scrollToBooking}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Request Industry Plan
        </button>
        <button
          onClick={() => openWhatsApp(buildIndustryEnquiryUrl(industry.name))}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 text-sm font-semibold rounded-xl transition-colors"
        >
          <WhatsAppIcon />
          WhatsApp About This
        </button>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse p-7">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-[52px] h-[52px] bg-slate-100 rounded-xl flex-shrink-0" />
        <div className="h-5 bg-slate-100 rounded-lg w-1/2" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 bg-slate-100 rounded-lg mb-2 w-full" />
      ))}
      <div className="h-3 bg-slate-100 rounded-lg mb-5 w-3/4" />
      <div className="flex gap-1.5 mb-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-slate-100 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2.5">
        <div className="flex-1 h-10 bg-slate-100 rounded-xl" />
        <div className="flex-1 h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )
}

export default function IndustriesPage() {
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Commercial Pest Control for Industries | SP Pest Control'
  }, [])

  useEffect(() => {
    getIndustries()
      .then((res) => {
        const data = res.data?.data?.industries || res.data?.industries || res.data || []
        setIndustries(Array.isArray(data) && data.length > 0 ? data : fallbackIndustries)
      })
      .catch(() => setIndustries(fallbackIndustries))
      .finally(() => setLoading(false))
  }, [])

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
            <span className="text-white/70">Industries</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Industries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Pest Control Across Key Industries
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              SP Pest Control provides professional, compliant, and discreet pest management for businesses across multiple sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              : industries.map((industry, i) => (
                  <IndustryCard key={industry.id} industry={industry} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* Commercial Enquiry / Booking */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Commercial Enquiry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
              Request a Commercial Pest Control Plan
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Fill in your details and select Commercial Pest Control or Industry-Specific Pest Control as your service type.
            </p>
          </motion.div>
        </div>
      </section>

      <BookingForm />

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
