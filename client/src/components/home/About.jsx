import { motion } from 'framer-motion'
import { CheckCircle, Shield, Users, Clock, MapPin, Star } from 'lucide-react'
import { stockImages } from '../../constants/stockImages'

const highlights = [
  'Fast Response Times Across Brakpan',
  'Safe, Professional Treatment Methods',
  'Residential & Commercial Services',
  'Available 24/7 for Emergencies',
  'Experienced & Knowledgeable Local Team',
  'Tailored Pest Control Solutions',
]

const stats = [
  { icon: Clock, label: 'Available', value: '24/7' },
  { icon: MapPin, label: 'Local Since', value: 'Day 1' },
  { icon: Users, label: 'Customers', value: '500+' },
  { icon: Star, label: 'Satisfaction', value: '100%' },
]

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-5">
              <span className="text-green-600 text-xs font-bold uppercase tracking-widest">About Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-6 leading-tight">
              Your Trusted Local Pest Control Experts in Brakpan
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed mb-8">
              <p>
                Sp Pest Control provides reliable, professional pest control services across Brakpan and surrounding areas. We understand how stressful pest problems can be — whether it's cockroaches in your kitchen, rodents in your walls, or termites threatening your property.
              </p>
              <p>
                Our experienced team uses safe, effective treatments to eliminate pests quickly and professionally. We take pride in our fast response times, attention to detail, and commitment to customer satisfaction.
              </p>
              <p>
                From once-off treatments to ongoing pest management contracts, we are here to help you maintain a clean, safe, and pest-free environment. With Sp Pest Control, you deal directly with a knowledgeable local team that genuinely cares about delivering results.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 font-medium">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-3xl aspect-[4/3] shadow-xl">
              <img
                src={stockImages.about}
                alt="Pest control technician treating an outdoor residential area"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
              <div className="absolute left-5 bottom-5 right-5">
                <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-3 text-sm font-bold text-navy-900 shadow-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  Safe treatments for homes and businesses
                </div>
              </div>
            </div>

            <div className="bg-navy-900 rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="font-bold text-base">Why Sp Pest Control?</div>
                  <div className="text-white/50 text-xs">Trusted locally in Brakpan</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                    <Icon className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-black text-green-400">{value}</div>
                    <div className="text-white/60 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {['Direct, honest service', 'No hidden call-out fees', 'We treat every job as urgent'].map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {pt}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <div className="text-green-700 font-bold text-base mb-1">Serving Brakpan & Surrounding Areas</div>
              <p className="text-green-600 text-sm">Including Springs, Boksburg, Benoni, Ekurhuleni and surrounding East Rand communities.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
