import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle, RotateCcw, AlertCircle, Loader2, CreditCard, FileText, Clock } from 'lucide-react'
import { submitBooking } from '../../utils/api'
import { buildBookingUrl, openWhatsApp } from '../../utils/whatsapp'

const pestOptions = [
  'Cockroaches',
  'Ants',
  'Bed Bugs',
  'Rodents / Rats',
  'Silverfish',
  'Bees',
  'Birds / Pigeons',
  'Fleas & Ticks',
  'Scorpions',
  'Spiders',
  'Wasps',
  'Termites',
  'Flies',
  'General Pest Control',
  'Other',
]

const timeOptions = [
  'Morning (7am – 10am)',
  'Mid-Morning (10am – 12pm)',
  'Afternoon (12pm – 3pm)',
  'Late Afternoon (3pm – 6pm)',
  'Evening (6pm – 8pm)',
  'Flexible',
]

const customerTypeOptions = [
  'Residential',
  'Commercial',
  'Property Manager',
  'School',
  'Restaurant',
  'Retail',
  'Other',
]

const serviceCategoryOptions = [
  'Once-Off Service',
  'RatGuard Monthly',
  'RoachGuard 360',
  'AntArmor 365',
  'Commercial Pest Control',
  'Industry-Specific Pest Control',
]

const paymentOptions = [
  { val: 'quote_first', label: 'Request a Quote First', sub: 'We\'ll contact you with pricing', icon: FileText, color: 'green' },
  { val: 'pay_now', label: 'Pay Deposit Online Now', sub: 'Secure card payment via PayFast', icon: CreditCard, color: 'blue' },
  { val: 'pay_after', label: 'Pay After Confirmation', sub: 'Pay once booking is confirmed', icon: Clock, color: 'amber' },
]

const initialForm = {
  full_name: '',
  phone: '',
  email: '',
  address: '',
  customer_type: 'Residential',
  service_category: '',
  pest_problem: '',
  preferred_date: '',
  preferred_time: '',
  urgency: 'normal',
  message: '',
  payment_option: 'quote_first',
}

export default function BookingForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [serverError, setServerError] = useState('')

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Full name is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.pest_problem) errs.pest_problem = 'Please select a pest problem'
    if (!form.customer_type) errs.customer_type = 'Please select a customer type'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setServerError('')
    try {
      const res = await submitBooking(form)
      const bookingData = res.data.data.booking
      if (form.payment_option === 'pay_now') {
        navigate(`/payment/checkout/${bookingData.id}`, { state: { booking: bookingData } })
        return
      }
      setSubmittedData({ ...form, id: bookingData.id })
      setSubmitted(true)
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to submit booking. Please try again or contact us via WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setForm(initialForm); setSubmitted(false); setSubmittedData(null); setErrors({}); setServerError('') }

  const inputCls = (field) => `input-field ${errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`

  if (submitted && submittedData) {
    return (
      <section id="booking" className="section-padding bg-slate-50">
        <div className="max-w-2xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-navy-900 mb-3">Booking Submitted Successfully!</h2>
            <p className="text-slate-500 mb-2">Thank you, <strong className="text-navy-900">{submittedData.full_name}</strong>.</p>
            <p className="text-slate-500 mb-8">We'll review your booking and contact you shortly to confirm your appointment.</p>

            <div className="bg-slate-50 rounded-2xl p-5 text-left mb-8 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Pest Problem</span>
                <span className="font-semibold text-navy-900">{submittedData.pest_problem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Type</span>
                <span className="font-semibold text-navy-900">{submittedData.customer_type}</span>
              </div>
              {submittedData.service_category && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Type</span>
                  <span className="font-semibold text-navy-900">{submittedData.service_category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Urgency</span>
                <span className={`font-semibold capitalize ${submittedData.urgency === 'emergency' ? 'text-red-500' : submittedData.urgency === 'urgent' ? 'text-amber-500' : 'text-green-600'}`}>
                  {submittedData.urgency}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openWhatsApp(buildBookingUrl(submittedData))}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Also Send via WhatsApp
              </button>
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Make Another Booking
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Online Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Book a Pest Control Service</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Fill in your details below and we'll contact you to confirm your booking.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="bg-navy-900 px-8 py-5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <span className="text-white/60 text-sm font-medium">Pest Control Booking — SP Pest Control</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {serverError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Your full name" className={inputCls('full_name')} />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="071 000 0000" className={inputCls('phone')} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputCls('email')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address / Area <span className="text-red-500">*</span></label>
                <input type="text" value={form.address} onChange={set('address')} placeholder="Your suburb or area" className={inputCls('address')} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Type <span className="text-red-500">*</span></label>
                <select value={form.customer_type} onChange={set('customer_type')} className={inputCls('customer_type')}>
                  {customerTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.customer_type && <p className="text-red-500 text-xs mt-1">{errors.customer_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Type</label>
                <select value={form.service_category} onChange={set('service_category')} className={inputCls('service_category')}>
                  <option value="">Select service type...</option>
                  {serviceCategoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pest Problem <span className="text-red-500">*</span></label>
                <select value={form.pest_problem} onChange={set('pest_problem')} className={inputCls('pest_problem')}>
                  <option value="">Select pest problem...</option>
                  {pestOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.pest_problem && <p className="text-red-500 text-xs mt-1">{errors.pest_problem}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Date</label>
                <input type="date" value={form.preferred_date} onChange={set('preferred_date')} min={new Date().toISOString().split('T')[0]} className={inputCls('preferred_date')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Time</label>
                <select value={form.preferred_time} onChange={set('preferred_time')} className={inputCls('preferred_time')}>
                  <option value="">Select a time...</option>
                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urgency</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: 'normal', label: 'Normal', sub: 'Within a few days', cls: 'border-slate-200 hover:border-green-300' },
                  { val: 'urgent', label: 'Urgent', sub: 'Within 24 hours', cls: 'border-amber-200 hover:border-amber-400' },
                  { val: 'emergency', label: 'Emergency', sub: 'ASAP', cls: 'border-red-200 hover:border-red-400' },
                ].map(({ val, label, sub, cls }) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setForm(prev => ({ ...prev, urgency: val }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.urgency === val
                        ? val === 'normal'
                          ? 'bg-green-50 border-green-500'
                          : val === 'urgent'
                          ? 'bg-amber-50 border-amber-500'
                          : 'bg-red-50 border-red-500'
                        : cls
                    }`}
                  >
                    <div className={`font-bold text-sm ${
                      form.urgency === val
                        ? val === 'normal'
                          ? 'text-green-700'
                          : val === 'urgent'
                          ? 'text-amber-700'
                          : 'text-red-700'
                        : 'text-slate-700'
                    }`}>{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentOptions.map(({ val, label, sub, icon: Icon, color }) => {
                  const active = form.payment_option === val
                  const activeCls = {
                    green: 'bg-green-50 border-green-500',
                    blue: 'bg-blue-50 border-blue-500',
                    amber: 'bg-amber-50 border-amber-500',
                  }[color]
                  const textCls = {
                    green: 'text-green-700',
                    blue: 'text-blue-700',
                    amber: 'text-amber-700',
                  }[color]
                  const iconBg = {
                    green: 'bg-green-100 text-green-600',
                    blue: 'bg-blue-100 text-blue-600',
                    amber: 'bg-amber-100 text-amber-600',
                  }[color]
                  return (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setForm(prev => ({ ...prev, payment_option: val }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${active ? activeCls : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${active ? iconBg : 'bg-slate-100 text-slate-400'}`}>
                        <Icon size={14} />
                      </div>
                      <div className={`font-bold text-xs ${active ? textCls : 'text-slate-700'}`}>{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-tight">{sub}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message / Extra Details</label>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="Describe your pest problem, how long you've had it, severity, etc."
                rows={4}
                className={inputCls('message') + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : form.payment_option === 'pay_now' ? (
                <><CreditCard className="w-5 h-5" /> Continue to Secure Payment</>
              ) : 'Submit Booking Request'}
            </button>
            <p className="text-center text-slate-400 text-xs">We'll contact you within a few hours to confirm your booking.</p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
