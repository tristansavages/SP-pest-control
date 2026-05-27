import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'Do you offer pest control in Brakpan?', a: 'Yes, Jb Pest Control is based in Brakpan and provides pest control services across Brakpan and the surrounding areas, including Springs, Boksburg, Benoni, and the greater East Rand.' },
  { q: 'Are you available 24 hours?', a: 'Yes, we are available 24 hours a day, 7 days a week. Whether you have a normal pest problem or a late-night emergency, you can contact us at any time.' },
  { q: 'Can I book through WhatsApp?', a: 'Absolutely. You can send us a WhatsApp message at 071 949 5929 at any time. We respond quickly and can arrange a booking via WhatsApp for your convenience.' },
  { q: 'Do you treat cockroaches and rodents?', a: 'Yes, cockroach control and rodent/rat control are among our most common services. We use professional treatments to eliminate both cockroaches and rodents from homes and businesses.' },
  { q: 'Do you offer commercial pest control?', a: 'Yes, we provide professional pest control services for businesses, warehouses, offices, restaurants, and all types of commercial properties. We can also arrange regular maintenance contracts.' },
  { q: 'How do I book a pest control service?', a: 'You can book via our online booking form on this website, call us directly on 071 949 5929, or send us a WhatsApp message. We\'ll confirm your booking and arrange a suitable time.' },
  { q: 'Is the treatment safe for families and pets?', a: 'We use professional, industry-approved treatments that are safe when applied correctly. We advise customers on appropriate safety precautions, such as vacating the treated area for a short period. We will guide you on what to expect.' },
  { q: 'Do you handle urgent and emergency pest control?', a: 'Yes, we handle urgent and emergency pest control requests. If you have an emergency pest problem, contact us immediately and we will prioritise your situation.' },
  { q: 'What areas do you service?', a: 'We primarily service Brakpan and the surrounding East Rand areas. This includes Springs, Boksburg, Benoni, and nearby communities. Contact us to confirm if we cover your specific area.' },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-white'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${isOpen ? 'text-green-700' : 'text-navy-900'}`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${isOpen ? 'text-green-500' : 'text-slate-400'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5">
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg">Everything you need to know about pest control with Jb Pest Control.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
