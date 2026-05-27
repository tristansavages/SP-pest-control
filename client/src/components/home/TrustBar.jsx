import { motion } from 'framer-motion'
import { Award, Users, Clock, MapPin, Shield } from 'lucide-react'

const stats = [
  { icon: Award, value: '10+', label: 'Years Experience', color: 'text-green-500' },
  { icon: Users, value: '500+', label: 'Happy Customers', color: 'text-blue-500' },
  { icon: Clock, value: '24/7', label: 'Emergency Service', color: 'text-amber-500' },
  { icon: MapPin, value: '100%', label: 'Local Brakpan', color: 'text-green-500' },
  { icon: Shield, value: 'Safe', label: 'Treatment Methods', color: 'text-emerald-500' },
]

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-2 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-navy-900">{value}</div>
              <div className="text-slate-500 text-xs font-medium mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
