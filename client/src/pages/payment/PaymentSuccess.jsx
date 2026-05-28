import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle, Home, Calendar } from 'lucide-react'
import { buildWhatsAppUrl, openWhatsApp } from '../../utils/whatsapp'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const ref = params.get('ref') || ''

  const waMsg = `Hi SP Pest Control! I have just completed my online payment successfully.\n\nPayment Reference: ${ref}\n\nPlease confirm my booking and let me know when to expect the technician. Thank you!`

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-black text-navy-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-4">
          Your payment has been received. We will contact you shortly to confirm your booking details and schedule your service.
        </p>

        {ref && (
          <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="text-slate-400">Payment Reference</span>
            <p className="font-bold text-navy-900 font-mono mt-0.5">{ref}</p>
            <p className="text-slate-400 text-xs mt-1">Keep this for your records</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => openWhatsApp(buildWhatsAppUrl(waMsg))}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl transition-colors"
          >
            <MessageCircle size={18} />
            Confirm on WhatsApp
          </button>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition-colors text-sm"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>

        <p className="text-slate-400 text-xs mt-6">
          Questions? WhatsApp us anytime — we're here to help.
        </p>
      </motion.div>
    </div>
  )
}
