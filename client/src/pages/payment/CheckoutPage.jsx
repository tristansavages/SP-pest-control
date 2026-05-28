import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, CreditCard, MessageCircle, ChevronRight, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import api from '../../utils/api'
import { buildWhatsAppUrl, openWhatsApp, WHATSAPP_NUMBER } from '../../utils/whatsapp'

const PAYMENT_INFO = {
  'RatGuard Monthly': { amount: 260, label: 'First Month Payment', type: 'plan_subscription', note: 'Monthly plan — billed R260/month after first payment' },
  'RoachGuard 360': { amount: 120, label: 'First Month Payment', type: 'plan_subscription', note: 'Monthly plan — billed R120/month after first payment' },
  'AntArmor 365': { amount: 156, label: 'First Month Payment', type: 'plan_subscription', note: 'Monthly plan — billed R156/month after first payment' },
  'Commercial Pest Control': { amount: 250, label: 'Booking Deposit', type: 'once_off', note: 'Deposit to confirm booking — balance invoiced after assessment' },
  'Industry-Specific Pest Control': { amount: 200, label: 'Booking Deposit', type: 'once_off', note: 'Deposit to confirm booking — balance invoiced after assessment' },
}
const DEFAULT_PAYMENT_INFO = { amount: 150, label: 'Booking Deposit', type: 'once_off', note: 'Deposit to confirm booking — balance invoiced after job assessment' }

function formatZAR(amount) {
  return `R ${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export default function CheckoutPage() {
  const { bookingId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const booking = state?.booking

  useEffect(() => {
    if (!booking) navigate('/', { replace: true })
  }, [booking, navigate])

  if (!booking) return null

  const serviceCategory = booking.service_category || 'Once-Off Service'
  const paymentInfo = PAYMENT_INFO[serviceCategory] || DEFAULT_PAYMENT_INFO
  const { amount, label, type, note } = paymentInfo

  const nameParts = (booking.full_name || '').split(' ')
  const nameFirst = nameParts[0] || ''
  const nameLast = nameParts.slice(1).join(' ') || ''

  const handlePayNow = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/payments/create', {
        booking_id: booking.id,
        amount,
        item_name: `${serviceCategory === 'Once-Off Service' ? 'Pest Control Service' : serviceCategory} — ${label}`,
        item_description: `Booking #${booking.id} | ${booking.pest_problem}`,
        name_first: nameFirst,
        name_last: nameLast,
        email_address: booking.email || '',
        payment_type: type,
      })

      const { gateway, url, fields, merchant_reference } = res.data.data

      if (gateway === 'payfast') {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = url
        form.style.display = 'none'
        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
        return
      }

      // Gateway not configured — guide via WhatsApp
      const waMsg = `Hi SP Pest Control, I have submitted a booking (#${booking.id}) and would like to arrange payment. Reference: ${merchant_reference}. Please contact me.`
      setError('')
      setLoading(false)
      openWhatsApp(buildWhatsAppUrl(waMsg))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate payment. Please try again or contact us via WhatsApp.')
      setLoading(false)
    }
  }

  const waFallback = buildWhatsAppUrl(`Hi SP Pest Control, I'd like to arrange payment for booking #${booking.id} (${serviceCategory}). Please assist.`)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-navy-900 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
              <img src="/sp-pest-control-logo.png" alt="SP Pest Control" className="w-[130%] h-[130%] object-contain" />
            </div>
            <span className="text-white font-bold text-sm hidden sm:block">SP Pest Control</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <Lock size={13} />
            <span className="hidden sm:block">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
          {/* Order Summary */}
          <div className="lg:col-span-3 space-y-4">
            <h1 className="text-2xl font-black text-navy-900">Complete Your Payment</h1>
            <p className="text-slate-500 text-sm">Review your booking summary below before proceeding to payment.</p>

            {/* Booking Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-navy-900 px-5 py-3.5 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-white text-sm font-semibold">Booking Confirmed — #{booking.id}</span>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row label="Customer" value={booking.full_name} />
                <Row label="Phone" value={booking.phone} />
                {booking.email && <Row label="Email" value={booking.email} />}
                <Row label="Address" value={booking.address} />
                <Row label="Pest Problem" value={booking.pest_problem} />
                <Row label="Service Type" value={serviceCategory} />
                {booking.preferred_date && <Row label="Preferred Date" value={booking.preferred_date} />}
                {booking.urgency && <Row label="Urgency" value={<span className="capitalize">{booking.urgency}</span>} />}
              </div>
            </div>

            {/* Secure notice */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
              <Shield size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Secure & Encrypted Payment</p>
                <p className="text-green-700 text-xs mt-0.5">Payments are processed securely via PayFast. Your card details are never stored by SP Pest Control.</p>
              </div>
            </div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Amount Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Payment Summary</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 text-sm">{label}</span>
                <span className="font-black text-navy-900 text-lg">{formatZAR(amount)}</span>
              </div>
              <p className="text-slate-400 text-xs mb-4">{note}</p>

              <div className="border-t border-slate-100 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total Due Now</span>
                  <span className="font-black text-green-600 text-xl">{formatZAR(amount)}</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">Includes VAT where applicable</p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs mb-4">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 mb-3"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard size={18} /> Pay {formatZAR(amount)} Now <ChevronRight size={16} /></>
                )}
              </button>

              <div className="text-center text-slate-400 text-xs flex items-center justify-center gap-1">
                <Lock size={11} />
                Secured by PayFast — 256-bit SSL
              </div>
            </div>

            {/* WhatsApp alternative */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
              <p className="text-slate-500 text-xs mb-3">Prefer to arrange payment manually?</p>
              <button
                onClick={() => openWhatsApp(waFallback)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Us to Arrange
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-4 text-slate-400 text-xs border-t border-slate-100">
        © {new Date().getFullYear()} SP Pest Control — All rights reserved
      </footer>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 flex-shrink-0">{label}</span>
      <span className="font-semibold text-navy-900 text-right">{value}</span>
    </div>
  )
}
