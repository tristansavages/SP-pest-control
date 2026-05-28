import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What pests do you treat?',
    a: 'SP Pest Control treats a wide range of pests including cockroaches, ants, rodents, termites, bed bugs, fleas and ticks, spiders, wasps, bees, flies, silverfish, and birds or pigeons. We offer both residential and commercial pest control services.',
  },
  {
    q: 'Do you offer once-off pest control services?',
    a: 'Yes, we offer once-off pest control services for homeowners and businesses that need professional help with a current pest problem without committing to a subscription.',
  },
  {
    q: 'Do you offer monthly pest control plans?',
    a: 'Yes, we offer three home protection plans: RatGuard Monthly for rodent protection, RoachGuard 360 for year-round cockroach control, and AntArmor 365 for annual ant barrier protection. Each plan offers professional, proactive pest management at a predictable monthly cost.',
  },
  {
    q: 'How does RatGuard Monthly work?',
    a: 'RatGuard Monthly provides professional installation of four tamper-resistant bait stations around your property, with a monthly technician visit for inspection, monitoring, and bait replenishment. It helps keep rats outside where they belong through proactive monthly monitoring.',
  },
  {
    q: 'How does RoachGuard 360 work?',
    a: 'RoachGuard 360 is a monthly subscription that includes four professional cockroach treatments per year — one every three months. This schedule is designed to break the cockroach breeding cycle and help prevent reinfestation, rather than simply treating one outbreak at a time.',
  },
  {
    q: 'How does AntArmor 365 work?',
    a: 'AntArmor 365 is a 12-month subscription that includes two full-scale professional ant treatments per year, timed for spring and summer. The treatment uses non-repellent transfer technology and exterior perimeter shielding to target the colony at the source and help keep ants from returning.',
  },
  {
    q: 'Are your treatments suitable for homes with pets and children?',
    a: 'We use professional, industry-approved treatments applied by trained technicians. We provide guidance on appropriate precautions such as vacating treated areas for a short period. Your technician will advise you on what to expect before, during, and after treatment.',
  },
  {
    q: 'Do you offer pest control for restaurants and food businesses?',
    a: 'Yes. SP Pest Control provides pest management programmes specifically designed for food service environments, including commercial kitchens, restaurants, cafeterias, and food storage areas. We help businesses maintain food safety standards and protect their reputation.',
  },
  {
    q: 'Can you help schools and educational facilities?',
    a: 'Yes. We provide pest control solutions designed to be effective, discreet, and suitable for sensitive educational environments including preschools, public schools, private campuses, and university accommodation.',
  },
  {
    q: 'Do you work around business hours for commercial clients?',
    a: 'Yes. We understand that businesses cannot always stop operations for pest control. We work with commercial clients to schedule services at times that minimise disruption, including early morning, after hours, and weekend appointments.',
  },
  {
    q: 'How do I book a service?',
    a: 'You can book via the online booking form on this website, or you can send us a WhatsApp message directly. We will get back to you promptly to confirm your booking and arrange a suitable appointment time.',
  },
  {
    q: 'Do you handle urgent pest problems?',
    a: 'Yes. We prioritise urgent and emergency pest control requests. If you have an active infestation that needs immediate attention, select the urgent or emergency option on our booking form and we will respond as quickly as possible.',
  },
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
          <p className="text-slate-500 text-lg">Everything you need to know about pest control with SP Pest Control.</p>
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
