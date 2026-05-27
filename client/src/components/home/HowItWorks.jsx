import { motion } from 'framer-motion'
import { PhoneCall, ClipboardCheck, Wrench, CheckCircle } from 'lucide-react'

const steps = [
  { number: '01', icon: PhoneCall, title: 'Contact or Book Online', description: 'Fill in our booking form, give us a call on 071 949 5929, or send us a quick WhatsApp message. We respond fast.', color: 'bg-blue-500' },
  { number: '02', icon: ClipboardCheck, title: 'Confirm the Problem', description: 'We confirm the pest issue, your property type, location, and urgency so we can prepare the right treatment.', color: 'bg-green-500' },
  { number: '03', icon: Wrench, title: 'Professional Service', description: 'Our team attends to the pest problem using professional, effective, and safe treatment methods.', color: 'bg-amber-500' },
  { number: '04', icon: CheckCircle, title: 'Peace of Mind', description: 'You receive reliable, professional service and support — leaving you with a cleaner, safer, pest-free space.', color: 'bg-emerald-500' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-navy-900">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/15 border border-green-500/30 rounded-full mb-4">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Simple. Fast. Professional.</h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Getting your pest problem sorted is straightforward with Jb Pest Control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-px bg-white/10 -translate-y-1/2 z-0" style={{ left: '12.5%', right: '12.5%' }} />

          {steps.map(({ number, icon: Icon, title, description, color }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-5 shadow-2xl`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-white/20 text-5xl font-black absolute top-0 right-4 leading-none pointer-events-none select-none">{number}</div>
              <h3 className="text-white font-bold text-base mb-3 leading-tight">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-xl shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started — Book Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}
