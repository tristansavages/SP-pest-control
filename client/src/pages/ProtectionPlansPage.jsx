import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, CheckCircle, Shield, TrendingUp, Wrench, Heart, ChevronDown } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import BookingForm from '../components/home/BookingForm'
import { getPlans } from '../utils/api'
import { buildPlanEnquiryUrl, openWhatsApp } from '../utils/whatsapp'

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const fallbackPlans = [
  {
    id: 1,
    name: 'RatGuard Monthly',
    slug: 'ratguard-monthly',
    tagline: 'Proactive rat protection for your home',
    monthly_price: 260,
    frequency: '1 Visit / Month',
    included_visits: 12,
    extra_callout_cost: null,
    highlight: 0,
    features: JSON.stringify([
      'Professional installation of 4 tamper-resistant bait stations',
      'Monthly technician visit',
      'Station inspection and bait replenishment',
      'Monitoring for new rodent activity',
      'Detailed reporting after every visit',
    ]),
  },
  {
    id: 2,
    name: 'RoachGuard 360',
    slug: 'roachguard-360',
    tagline: 'Year-round cockroach protection',
    monthly_price: 120,
    frequency: '4 Treatments / Year',
    included_visits: 4,
    extra_callout_cost: 120,
    highlight: 1,
    features: JSON.stringify([
      '4 professional cockroach treatments per year',
      'One treatment every 3 months',
      'Designed to break the breeding cycle',
      'Professional-grade gels and targeted sprays',
      'Member rate for extra top-up treatments',
    ]),
  },
  {
    id: 3,
    name: 'AntArmor 365',
    slug: 'antarmor-365',
    tagline: 'Year-round ant barrier protection',
    monthly_price: 156,
    frequency: '2 Treatments / Year',
    included_visits: 2,
    extra_callout_cost: 150,
    highlight: 0,
    features: JSON.stringify([
      'Bi-annual deep treatment',
      'Non-repellent transfer technology',
      'Exterior perimeter shielding',
      'Garden colony mapping',
      'Priority emergency member rate',
    ]),
  },
]

const benefitCards = [
  {
    Icon: Shield,
    title: 'Proactive, Not Reactive',
    text: 'Our plans are designed to prevent pest problems before they escalate. Regular visits keep your home protected year-round.',
  },
  {
    Icon: TrendingUp,
    title: 'Predictable Monthly Cost',
    text: 'No surprise large invoices. Pay a fixed monthly amount and know exactly what you are getting.',
  },
  {
    Icon: Wrench,
    title: 'Professional Expertise',
    text: 'Trained technicians using professional-grade products that are not available over the counter.',
  },
  {
    Icon: Heart,
    title: 'Peace of Mind',
    text: 'Regular monitoring and treatments so you do not have to worry about pest problems returning.',
  },
]

const faqs = [
  {
    q: 'How do protection plans work?',
    a: 'After signing up, our technician will schedule your first visit. On each visit, the technician will inspect and treat the target pest area. You receive a report after every visit and we monitor for any new activity between visits.',
  },
  {
    q: 'Can I cancel a plan?',
    a: 'Yes. We require 30 days written notice to cancel a plan. There are no long-term lock-in contracts for most plans, except for AntArmor 365 which requires a 12-month commitment.',
  },
  {
    q: 'Can I get extra treatments on a plan?',
    a: 'Yes. Plan members receive a preferential member rate for any extra call-out treatments booked outside their scheduled visits. Rates vary per plan.',
  },
  {
    q: 'Are the treatments safe for pets and children?',
    a: 'Yes. We use professional-grade products that are safe once dry or set. Our technician will advise you on any specific precautions needed for your treatment type before and after the visit.',
  },
  {
    q: 'How do I sign up for a plan?',
    a: 'Simply complete the booking form on this page, select your preferred plan, and our team will contact you to schedule your first visit and confirm your subscription details.',
  },
]

function PlanCard({ plan, index }) {
  const isHighlighted = plan.highlight === 1 || plan.highlight === true

  let features = []
  try {
    features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || []
  } catch {
    features = []
  }

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 ${
        isHighlighted
          ? 'border-2 border-green-500 shadow-xl scale-105'
          : 'border border-slate-100 shadow-sm hover:shadow-md'
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className={`p-7 pb-5 rounded-t-2xl ${isHighlighted ? 'bg-green-50' : 'bg-white'}`}>
        <h3 className="text-xl font-black text-navy-900 mb-1">{plan.name}</h3>
        <p className="text-slate-500 text-sm mb-5">{plan.tagline}</p>
        <div className="flex items-end gap-1.5 mb-1">
          <span className="text-4xl font-black text-navy-900">R{plan.monthly_price}</span>
          <span className="text-slate-400 text-sm mb-1.5">/mo</span>
        </div>
        <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
          {plan.frequency}
        </span>
        {plan.included_visits && (
          <p className="text-slate-400 text-xs mt-2">{plan.included_visits} visits included per year</p>
        )}
        {plan.extra_callout_cost && (
          <p className="text-slate-400 text-xs mt-0.5">Extra call-out: R{plan.extra_callout_cost}</p>
        )}
      </div>

      <div className="px-7 py-5 flex-1">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-7 pb-7 flex flex-col gap-2.5 mt-auto">
        <button
          onClick={scrollToBooking}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all text-sm ${
            isHighlighted
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              : 'bg-navy-900 hover:bg-navy-800 text-white'
          }`}
        >
          Subscribe to {plan.name}
        </button>
        <button
          onClick={() => openWhatsApp(buildPlanEnquiryUrl(plan.name))}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 text-sm font-semibold rounded-xl transition-colors"
        >
          <WhatsAppIcon />
          WhatsApp About This Plan
        </button>
      </div>
    </motion.div>
  )
}

function SkeletonPlanCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse">
      <div className="p-7 pb-5">
        <div className="h-5 bg-slate-100 rounded-lg w-2/3 mb-2" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2 mb-5" />
        <div className="h-10 bg-slate-100 rounded-lg w-1/3 mb-2" />
        <div className="h-6 bg-slate-100 rounded-full w-1/2" />
      </div>
      <div className="px-7 py-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded-lg mb-3 w-full" />
        ))}
      </div>
      <div className="px-7 pb-7 space-y-2.5">
        <div className="h-11 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-semibold text-navy-900 text-sm pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const comparisonData = {
  headers: ['Feature', 'RatGuard Monthly', 'RoachGuard 360', 'AntArmor 365'],
  rows: [
    ['Best For', 'Rodents', 'Cockroaches', 'Ants'],
    ['Monthly Price', 'R260/mo', 'R120/mo', 'R156/mo'],
    ['Visits Per Year', '12', '4', '2'],
    ['Target Pest', 'Rats & Mice', 'Cockroaches', 'Ants'],
    ['Extra Call-Out', 'Included in plan', 'R120.00', 'R150.00'],
    ['Commitment', 'Monthly', 'Monthly', '12 months'],
  ],
}

export default function ProtectionPlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Home Protection Plans | SP Pest Control'
  }, [])

  useEffect(() => {
    getPlans()
      .then((res) => {
        const data = res.data?.data?.plans || res.data?.plans || res.data || []
        setPlans(Array.isArray(data) && data.length > 0 ? data : fallbackPlans)
      })
      .catch(() => setPlans(fallbackPlans))
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
            <span className="text-white/70">Protection Plans</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Protection Plans</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Home Protection Plans</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Proactive, professional pest protection at a predictable monthly cost. Choose the plan that fits your home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {loading
              ? [...Array(3)].map((_, i) => <SkeletonPlanCard key={i} />)
              : plans.map((plan, i) => <PlanCard key={plan.id} plan={plan} index={i} />)}
          </div>
          <p className="text-center text-slate-400 text-sm mt-10">
            All plans include professional-grade treatments. Pricing is per month inclusive of VAT. 30 days notice required for cancellation.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Side by Side</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Compare Plans</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900">
                  {comparisonData.headers.map((header, i) => (
                    <th
                      key={i}
                      className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                        i === 0 ? 'text-white/50' : i === 2 ? 'text-green-400' : 'text-white/80'
                      }`}
                    >
                      {header}
                      {i === 2 && (
                        <span className="ml-2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">Popular</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {comparisonData.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-5 py-4 ${
                          ci === 0
                            ? 'text-slate-500 text-xs font-semibold uppercase tracking-wide'
                            : ci === 2
                            ? 'text-green-700 font-semibold'
                            : 'text-navy-900 font-medium'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Why Subscribe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Why a Plan Beats Once-Off</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefitCards.map(({ Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
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

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Plan Questions Answered</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
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
