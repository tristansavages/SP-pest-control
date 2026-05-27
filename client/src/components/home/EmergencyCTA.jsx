import { motion } from 'framer-motion'
import { Phone, MessageCircle, Zap } from 'lucide-react'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'

export default function EmergencyCTA() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-500 py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Pest Emergency? We Respond Fast — Available 24/7
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Don't wait. Call or WhatsApp us right now for urgent pest control in Brakpan and surrounding areas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:0719495929"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 hover:bg-green-50 font-bold rounded-xl shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Call 071 949 5929
            </a>
            <button
              onClick={() => openWhatsApp(DEFAULT_WA_URL)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Emergency
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
