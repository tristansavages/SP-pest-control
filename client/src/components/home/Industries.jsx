import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Coffee, Tag, BookOpen } from 'lucide-react'
import { getIndustries } from '../../utils/api'
import { buildIndustryEnquiryUrl, openWhatsApp } from '../../utils/whatsapp'

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
      'In multi-unit properties, a pest problem in one unit can quickly spread. SP Pest Control helps property managers stay ahead of pest issues with reliable service and proactive communication.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Building2',
  },
  {
    id: 2,
    name: 'Restaurants & Food Services',
    slug: 'restaurants-food-services',
    description:
      'In food service, reputation is everything. Keeping pests out is essential for food safety, regulatory compliance, and customer trust in every restaurant and commercial kitchen.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Coffee',
  },
  {
    id: 3,
    name: 'Retail Businesses',
    slug: 'retail-businesses',
    description:
      'In retail, first impressions matter. SP Pest Control offers discreet, effective pest management that helps protect your store, your brand, and your customers.',
    common_pests: JSON.stringify(['Rodents', 'Ants', 'Cockroaches', 'Flies', 'Termites']),
    icon: 'Tag',
  },
  {
    id: 4,
    name: 'Schools & Educational Facilities',
    slug: 'schools-educational-facilities',
    description:
      'In schools, learning should be the only thing buzzing. We provide pest control solutions designed to be effective, discreet, and suitable for sensitive educational environments.',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-green-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
    >
      <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
        <IndustryIcon name={industry.icon} />
      </div>
      <h3 className="font-bold text-navy-900 text-base mb-2">{industry.name}</h3>
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
        {industry.description}
      </p>
      {pests.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {pests.map((pest, i) => (
            <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
              {pest}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={scrollToBooking}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Request Industry Plan
        </button>
        <button
          onClick={() => openWhatsApp(buildIndustryEnquiryUrl(industry.name))}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 text-sm font-semibold rounded-xl transition-colors"
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse p-6">
      <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4" />
      <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded-lg w-full mb-1.5" />
      <div className="h-3 bg-slate-100 rounded-lg w-5/6 mb-1.5" />
      <div className="h-3 bg-slate-100 rounded-lg w-4/6 mb-4" />
      <div className="flex gap-1.5 mb-5">
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-9 bg-slate-100 rounded-xl mb-2" />
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  )
}

export default function Industries() {
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(true)

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
    <section id="industries" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Industries We Serve</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
            Professional Pest Control Across Key Industries
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            SP Pest Control works with businesses and organisations across multiple sectors to provide reliable, compliant, and discreet pest management services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : industries.map((industry, i) => (
                <IndustryCard key={industry.id} industry={industry} index={i} />
              ))}
        </div>
      </div>
    </section>
  )
}
