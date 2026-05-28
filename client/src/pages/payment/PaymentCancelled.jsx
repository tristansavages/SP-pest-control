import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, MessageCircle, RotateCcw, Home } from 'lucide-react'
import { buildWhatsAppUrl, openWhatsApp } from '../../utils/whatsapp'

export default function PaymentCancelled() {
  const [params] = useSearchParams()
  const ref = params.get('ref') || ''

  const waMsg = `Hi SP Pest Control, I started the online payment process but cancelled before completing it.\n\nPayment Reference: ${ref || 'N/A'}\n\nI would like to arrange an alternative payment method. Please contact me.`

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-black text-navy-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-4">
          You cancelled the payment process. Your booking is still saved — no worries. You can retry the payment or contact us to arrange an alternative.
        </p>

        {ref && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="text-amber-600 font-semibold">Reference: {ref}</span>
            <p className="text-slate-400 text-xs mt-0.5">Your booking is saved and awaiting payment</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/#booking"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            Try Payment Again
          </Link>
          <button
            onClick={() => openWhatsApp(buildWhatsAppUrl(waMsg))}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <MessageCircle size={16} />
            Arrange Via WhatsApp
          </button>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition-colors text-sm"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
