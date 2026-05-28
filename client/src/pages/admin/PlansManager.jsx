import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, X, Save, RefreshCw, CreditCard, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../../utils/api'

// ─── Slug helper ──────────────────────────────────────────────────────────────

const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

// ─── Plan Modal ───────────────────────────────────────────────────────────────

const PlanModal = ({ plan, onClose, onSave }) => {
  const isEdit = !!plan

  const parseFeatures = (val) => {
    if (!val) return ''
    try {
      const arr = typeof val === 'string' ? JSON.parse(val) : val
      return Array.isArray(arr) ? arr.join('\n') : val
    } catch {
      return val
    }
  }

  const [form, setForm] = useState({
    name: plan?.name || '',
    slug: plan?.slug || '',
    tagline: plan?.tagline || '',
    description: plan?.description || '',
    frequency: plan?.frequency || '',
    monthly_price: plan?.monthly_price || '',
    included_visits: plan?.included_visits || '',
    extra_callout_cost: plan?.extra_callout_cost || '',
    features: parseFeatures(plan?.features),
    terms: plan?.terms || '',
    highlight: plan?.highlight === 1 || plan?.highlight === true ? true : false,
    active: plan?.active !== undefined ? plan.active : true,
  })
  const [saving, setSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }))
  }

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true)
    setForm((prev) => ({ ...prev, slug: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Plan name is required')
      return
    }
    setSaving(true)

    // Parse features from newline or comma separated textarea
    let featuresJson = '[]'
    try {
      const raw = form.features || ''
      const lines = raw
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
      featuresJson = JSON.stringify(lines)
    } catch {
      featuresJson = '[]'
    }

    const payload = {
      ...form,
      features: featuresJson,
      monthly_price: parseFloat(form.monthly_price) || 0,
      included_visits: parseInt(form.included_visits) || null,
      extra_callout_cost: form.extra_callout_cost ? parseFloat(form.extra_callout_cost) : null,
      highlight: form.highlight ? 1 : 0,
    }

    try {
      let res
      if (isEdit) {
        res = await updatePlan(plan.id || plan._id, payload)
      } else {
        res = await createPlan(payload)
      }
      onSave(res.data?.data?.plan || res.data?.plan || res.data, isEdit)
      toast.success(isEdit ? 'Plan updated' : 'Plan created')
      onClose()
    } catch {
      toast.error(isEdit ? 'Failed to update plan' : 'Failed to create plan')
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
  const textareaCls =
    'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1.5'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Plan' : 'Add New Plan'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Plan Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. RoachGuard 360"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL Slug</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">/plans/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="roachguard-360"
                  className={`${inputCls} pl-[4.5rem] font-mono`}
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className={labelCls}>Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Short tagline for this plan"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Describe this protection plan..."
              className={textareaCls}
            />
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Monthly Price (R)</label>
              <input
                type="number"
                value={form.monthly_price}
                onChange={(e) => setForm((p) => ({ ...p, monthly_price: e.target.value }))}
                placeholder="120"
                min={0}
                step="0.01"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Included Visits / Year</label>
              <input
                type="number"
                value={form.included_visits}
                onChange={(e) => setForm((p) => ({ ...p, included_visits: e.target.value }))}
                placeholder="4"
                min={0}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Extra Call-Out Cost (R)</label>
              <input
                type="number"
                value={form.extra_callout_cost}
                onChange={(e) => setForm((p) => ({ ...p, extra_callout_cost: e.target.value }))}
                placeholder="120"
                min={0}
                step="0.01"
                className={inputCls}
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className={labelCls}>Frequency Text</label>
            <input
              type="text"
              value={form.frequency}
              onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}
              placeholder="e.g. Monthly — 1 visit per month"
              className={inputCls}
            />
          </div>

          {/* Features */}
          <div>
            <label className={labelCls}>Features</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
              rows={5}
              placeholder="Enter one feature per line (or comma-separated)&#10;e.g. Monthly technician visit&#10;Bait station inspection"
              className={textareaCls}
            />
            <p className="text-[11px] text-gray-400 mt-1">One feature per line or comma-separated. Stored as JSON array.</p>
          </div>

          {/* Terms */}
          <div>
            <label className={labelCls}>Terms Summary</label>
            <textarea
              value={form.terms}
              onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))}
              rows={2}
              placeholder="e.g. 30 days cancellation notice required."
              className={textareaCls}
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-700">Featured / Highlighted</p>
                <p className="text-xs text-gray-400">Show as "Most Popular"</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, highlight: !p.highlight }))}
                className="transition-opacity"
              >
                {form.highlight ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-700">Plan Active</p>
                <p className="text-xs text-gray-400">Show on website</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
                className="transition-opacity"
              >
                {form.active ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Saving…' : isEdit ? 'Update Plan' : 'Create Plan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Dialog ─────────────────────────────────────────────────────────────

const DeleteDialog = ({ plan, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Plan?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete{' '}
        <span className="font-semibold text-gray-700">"{plan?.name}"</span>. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PlansManager() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllPlans()
      const data = res.data?.data?.plans || res.data?.plans || (Array.isArray(res.data) ? res.data : [])
      setPlans(data)
    } catch {
      toast.error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleSave = (savedPlan, isEdit) => {
    if (isEdit) {
      setPlans((prev) =>
        prev.map((p) => (p.id === savedPlan.id || p._id === savedPlan._id ? savedPlan : p))
      )
    } else {
      setPlans((prev) => [...prev, savedPlan])
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deletePlan(deleteTarget.id || deleteTarget._id)
      setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id && p._id !== deleteTarget._id))
      toast.success('Plan deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete plan')
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = (plan) => {
    setEditingPlan(plan)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingPlan(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPlan(null)
  }

  const getFeatureCount = (features) => {
    try {
      const arr = typeof features === 'string' ? JSON.parse(features) : features
      return Array.isArray(arr) ? arr.length : 0
    } catch {
      return 0
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Protection Plans</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the home protection plans shown on your website
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlans}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-green-500/25"
          >
            <Plus size={16} />
            Add New Plan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Name', 'Tagline', 'Price', 'Frequency', 'Visits/Year', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <CreditCard size={32} className="text-gray-200" />
                      <p className="text-sm font-medium">No plans found</p>
                      <button
                        onClick={openAdd}
                        className="text-xs text-green-600 hover:text-green-700 font-semibold"
                      >
                        Add your first plan →
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan, idx) => (
                  <tr key={plan.id || plan._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <CreditCard size={14} className="text-green-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 whitespace-nowrap block">
                            {plan.name}
                          </span>
                          {(plan.highlight === 1 || plan.highlight === true) && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="text-xs text-gray-500 line-clamp-1">{plan.tagline || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800 whitespace-nowrap">
                        R{plan.monthly_price}/mo
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 whitespace-nowrap">{plan.frequency || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-gray-700">
                        {plan.included_visits ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {plan.active ? (
                          <CheckCircle size={11} />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                        )}
                        {plan.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(plan)}
                          title="Edit plan"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(plan)}
                          title="Delete plan"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && plans.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {plans.length} plan{plans.length !== 1 ? 's' : ''} total &bull;{' '}
            {plans.filter((p) => p.active).length} active
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <PlanModal plan={editingPlan} onClose={closeModal} onSave={handleSave} />
      )}
      {deleteTarget && (
        <DeleteDialog
          plan={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
