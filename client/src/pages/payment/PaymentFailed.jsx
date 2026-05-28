import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, MessageCircle, RotateCcw, Home, Phone } from 'lucide-react'
import { buildWhatsAppUrl, openWhatsApp, WHATSAPP_NUMBER } from '../../utils/whatsapp'

export default function PaymentFailed() {
  const [params] = useSearchParams()
  const ref = params.get('ref') || ''

  const waMsg = `Hi SP Pest Control, my online payment failed or was declined.\n\nPayment Reference: ${ref || 'N/A'}\n\nMy booking is still active and I would like to arrange payment via an alternative method. Please contact me.`

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-navy-900 mb-2">Payment Failed</h1>
        <p className="text-slate-500 mb-4">
          Your payment could not be processed. This may be due to insufficient funds, an expired card, or a temporary bank error. Your booking is still saved.
        </p>

        {ref && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="text-red-600 font-semibold">Reference: {ref}</span>
            <p className="text-slate-400 text-xs mt-0.5">Please use this when contacting us</p>
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm text-left">
          <p className="font-semibold text-slate-700 mb-2">What to do next:</p>
          <ul className="space-y-1.5 text-slate-500 text-xs">
            <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">•</span> Check your card details and try again</li>
            <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">•</span> Contact your bank if the issue persists</li>
            <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">•</span> WhatsApp us to arrange EFT or alternative payment</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            to="/#booking"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            Try Again
          </Link>
          <button
            onClick={() => openWhatsApp(buildWhatsAppUrl(waMsg))}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <MessageCircle size={16} />
            WhatsApp Us to Arrange Payment
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
