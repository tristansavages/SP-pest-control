import { motion } from 'framer-motion'
import { Clock, Shield, Building2, Zap, Award, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Available 24/7',
    description: 'Round-the-clock pest control service for urgent and non-urgent pest problems. Contact us any time.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Residential & Commercial',
    description: 'We provide professional pest control for homes, businesses, restaurants, schools, retail spaces, and multi-family properties.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Award,
    title: 'Safe & Effective Treatments',
    description: 'Professional-grade treatments that eliminate pests effectively and are applied safely by trained technicians.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Building2,
    title: 'Monthly Protection Plans',
    description: 'Our RatGuard, RoachGuard, and AntArmor plans provide proactive, year-round pest protection at a predictable monthly cost.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Zap,
    title: 'Fast Response Times',
    description: 'We understand urgency. Contact us and we respond quickly to assess and treat your pest problem professionally.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Award,
    title: 'Professional Service',
    description: 'A reliable team that treats every job with the same level of care and attention regardless of the size of the problem.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: MessageCircle,
    title: 'Easy WhatsApp Enquiries',
    description: 'Book a service, enquire about a plan, or ask a question instantly via WhatsApp. Fast, convenient, and always available.',
    color: 'bg-teal-50 text-teal-600',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-slate-50">
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
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">The SP Pest Control Difference</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Professional residential and commercial pest control designed around your needs — whether it is a once-off treatment, a protection plan, or a commercial programme.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-green-100 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
