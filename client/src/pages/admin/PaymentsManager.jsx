import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, Clock, XCircle, CheckCircle, AlertCircle,
  X, ChevronDown, RefreshCw, Eye, Loader2, Calendar, User, Hash, CreditCard,
} from 'lucide-react'
import api from '../../utils/api'
import { buildWhatsAppUrl, openWhatsApp } from '../../utils/whatsapp'

const STATUS_CONFIG = {
  complete: { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function formatZAR(amount) {
  return `R ${Number(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function PaymentsManager() {
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [paymentsRes, summaryRes] = await Promise.all([
        api.get('/payments'),
        api.get('/payments/revenue-summary'),
      ])
      setPayments(paymentsRes.data.data.payments || [])
      setSummary(summaryRes.data.data)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const filtered = payments.filter(p => filter === 'all' || p.status === filter)

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true)
    setUpdateError('')
    try {
      await api.put(`/payments/${id}`, { status: newStatus })
      await fetchAll()
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }))
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  const statCards = summary ? [
    { label: 'Total Revenue', value: formatZAR(summary.total_revenue), sub: 'All completed payments', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'This Month', value: formatZAR(summary.revenue_month), sub: 'Revenue this calendar month', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: summary.total_pending, sub: 'Awaiting completion', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Failed / Cancelled', value: summary.total_failed, sub: 'Payment issues', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ] : []

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-black text-navy-900">{value}</div>
            <div className="text-sm font-semibold text-slate-700 mt-0.5">{label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-slate-400" />
            <h2 className="font-bold text-slate-800">All Payments</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 text-xs font-semibold">
              {[
                { key: 'all', label: 'All' },
                { key: 'complete', label: 'Paid' },
                { key: 'pending', label: 'Pending' },
                { key: 'failed', label: 'Failed' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 transition-colors ${filter === key ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading payments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No payments found</p>
            <p className="text-sm mt-1">Payments will appear here once customers pay online.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Reference</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Service</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{p.merchant_reference}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{p.full_name || '—'}</div>
                      <div className="text-xs text-slate-400">{p.phone || ''}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[160px]">
                      <span className="text-slate-600 truncate block" title={p.item_name}>{p.item_name || '—'}</span>
                      <span className="text-xs text-slate-400 capitalize">{p.payment_type?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-800">{formatZAR(p.amount)}</td>
                    <td className="px-5 py-3.5 text-center"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => setSelected(p)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-semibold"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => { setSelected(null); setUpdateError('') }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-navy-900">
                <div>
                  <h3 className="font-bold text-white">Payment Details</h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">{selected.merchant_reference}</p>
                </div>
                <button onClick={() => { setSelected(null); setUpdateError('') }} className="text-white/60 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Detail label="Customer" value={selected.full_name || '—'} />
                  <Detail label="Phone" value={selected.phone || '—'} />
                  <Detail label="Amount" value={<span className="font-black text-green-600">{formatZAR(selected.amount)}</span>} />
                  <Detail label="Status" value={<StatusBadge status={selected.status} />} />
                  <Detail label="Booking ID" value={`#${selected.booking_id}`} />
                  <Detail label="Gateway" value={<span className="capitalize">{selected.gateway}</span>} />
                  <Detail label="Payment Type" value={selected.payment_type?.replace('_', ' ')} />
                  {selected.pf_payment_id && <Detail label="PF Payment ID" value={selected.pf_payment_id} />}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                  <div className="font-semibold text-slate-700 mb-1">Service</div>
                  {selected.item_name}
                  {selected.pest_problem && <div className="mt-1 text-slate-400">Pest: {selected.pest_problem}</div>}
                  {selected.address && <div className="text-slate-400">Address: {selected.address}</div>}
                </div>

                <div className="text-xs text-slate-400">Created: {formatDate(selected.created_at)}</div>

                {updateError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
                    <AlertCircle size={13} /> {updateError}
                  </div>
                )}

                {/* Manual status update */}
                {selected.status !== 'complete' && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Update Status Manually</p>
                    <div className="flex gap-2">
                      {selected.status !== 'complete' && (
                        <button
                          onClick={() => handleStatusUpdate(selected.id, 'complete')}
                          disabled={updating}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-60"
                        >
                          {updating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                          Mark as Paid
                        </button>
                      )}
                      {selected.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(selected.id, 'failed')}
                          disabled={updating}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg text-xs transition-colors disabled:opacity-60"
                        >
                          <XCircle size={12} /> Mark as Failed
                        </button>
                      )}
                      {selected.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(selected.id, 'cancelled')}
                          disabled={updating}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg text-xs transition-colors disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selected.status === 'complete' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs">
                    <CheckCircle size={14} /> Payment confirmed — booking updated to Scheduled.
                  </div>
                )}

                {/* WhatsApp follow-up */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">WhatsApp Follow-Up</p>
                  <div className="flex gap-2">
                    {selected.status === 'complete' && (
                      <button
                        onClick={() => openWhatsApp(buildWhatsAppUrl(`Hi ${selected.full_name || 'there'}, we've received your payment (Ref: ${selected.merchant_reference}). Thank you! We'll be in touch shortly to confirm your booking time. — SP Pest Control`))}
                        className="flex-1 text-xs py-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-lg transition-colors"
                      >
                        Send Payment Received
                      </button>
                    )}
                    {(selected.status === 'failed' || selected.status === 'pending') && (
                      <button
                        onClick={() => openWhatsApp(buildWhatsAppUrl(`Hi ${selected.full_name || 'there'}, we noticed your online payment for booking #${selected.booking_id} (Ref: ${selected.merchant_reference}) was not completed. Please let us know how you'd like to proceed — we can arrange EFT or another payment option. — SP Pest Control`))}
                        className="flex-1 text-xs py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-lg transition-colors"
                      >
                        Follow Up on Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-slate-400 text-xs block">{label}</span>
      <span className="font-semibold text-slate-800 mt-0.5 block">{value}</span>
    </div>
  )
}
