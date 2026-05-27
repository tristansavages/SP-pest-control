import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { submitContact } from '../../utils/api'
import { DEFAULT_WA_URL, openWhatsApp } from '../../utils/whatsapp'

const contactCards = [
  { icon: Phone, title: 'Phone', value: '071 949 5929', sub: 'Click to call', href: 'tel:0719495929', color: 'bg-blue-50 text-blue-600', action: null },
  { icon: MessageCircle, title: 'WhatsApp', value: '071 949 5929', sub: 'Open chat', href: null, color: 'bg-[#25D366]/10 text-[#25D366]', action: () => openWhatsApp(DEFAULT_WA_URL) },
  { icon: MapPin, title: 'Address', value: '7527 Jumba Street', sub: 'Brakpan, 1520', href: 'https://maps.google.com/?q=7527+Jumba+Street+Brakpan', color: 'bg-slate-100 text-slate-600', action: null },
  { icon: Clock, title: 'Hours', value: 'Open 24 Hours', sub: 'Available always', href: null, color: 'bg-green-50 text-green-600', action: null },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    try {
      await submitContact(form)
      setSubmitted(true)
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to send message. Please call us directly.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field) => `input-field ${errors[field] ? 'border-red-400' : ''}`

  return (
    <section id="contact" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Contact Jb Pest Control</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Have a question or need a quote? Get in touch — we're available 24/7.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left: Contact Cards + Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {contactCards.map(({ icon: Icon, title, value, sub, href, color, action }) => {
                const Card = (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-green-100 transition-all duration-200 cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-navy-900 text-sm">{title}</div>
                    <div className="font-bold text-navy-900">{value}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
                  </div>
                )
                if (action) return <button key={title} onClick={action} className="text-left w-full">{Card}</button>
                if (href) return <a key={title} href={href} target="_blank" rel="noopener noreferrer">{Card}</a>
                return <div key={title}>{Card}</div>
              })}
            </div>

            {/* Map placeholder */}
            <div className="bg-navy-900 rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 hero-grid opacity-50" />
              <div className="relative z-10 text-center">
                <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold text-sm">7527 Jumba Street</div>
                <div className="text-white/60 text-xs">Brakpan, 1520, South Africa</div>
                <a
                  href="https://maps.google.com/?q=7527+Jumba+Street+Brakpan+South+Africa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-navy-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 mb-6">We'll get back to you shortly.</p>
                  <button
                    onClick={() => openWhatsApp(DEFAULT_WA_URL)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Follow up on WhatsApp
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-navy-900 text-lg mb-5">Send a Message</h3>
                  {serverError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-4">
                      <AlertCircle className="w-4 h-4" />
                      {serverError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls('name')} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                        <input type="tel" value={form.phone} onChange={set('phone')} placeholder="071 000 0000" className={inputCls('phone')} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputCls('email')} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                      <textarea value={form.message} onChange={set('message')} placeholder="How can we help you?" rows={4} className={inputCls('message') + ' resize-none'} />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all duration-200"
                    >
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
