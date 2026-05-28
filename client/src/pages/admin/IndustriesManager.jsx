import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, X, Save, RefreshCw, Building2, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllIndustries, createIndustry, updateIndustry, deleteIndustry } from '../../utils/api'

// ─── Slug helper ──────────────────────────────────────────────────────────────

const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

// ─── Industry Modal ───────────────────────────────────────────────────────────

const IndustryModal = ({ industry, onClose, onSave }) => {
  const isEdit = !!industry

  const parsePests = (val) => {
    if (!val) return ''
    try {
      const arr = typeof val === 'string' ? JSON.parse(val) : val
      return Array.isArray(arr) ? arr.join(', ') : val
    } catch {
      return val
    }
  }

  const [form, setForm] = useState({
    name: industry?.name || '',
    slug: industry?.slug || '',
    description: industry?.description || '',
    common_pests: parsePests(industry?.common_pests),
    icon: industry?.icon || '',
    cta_text: industry?.cta_text || '',
    active: industry?.active !== undefined ? industry.active : true,
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
      toast.error('Industry name is required')
      return
    }
    setSaving(true)

    // Parse common_pests from comma-separated input
    let pestsJson = '[]'
    try {
      const pestArr = form.common_pests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      pestsJson = JSON.stringify(pestArr)
    } catch {
      pestsJson = '[]'
    }

    const payload = {
      ...form,
      common_pests: pestsJson,
    }

    try {
      let res
      if (isEdit) {
        res = await updateIndustry(industry.id || industry._id, payload)
      } else {
        res = await createIndustry(payload)
      }
      onSave(res.data?.data?.industry || res.data?.industry || res.data, isEdit)
      toast.success(isEdit ? 'Industry updated' : 'Industry created')
      onClose()
    } catch {
      toast.error(isEdit ? 'Failed to update industry' : 'Failed to create industry')
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Industry' : 'Add New Industry'}
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
              <label className={labelCls}>Industry Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Restaurants & Food Services"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL Slug</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">/industries/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="restaurants-food-services"
                  className={`${inputCls} pl-[6rem] font-mono`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              placeholder="Describe pest control for this industry sector..."
              className={textareaCls}
            />
          </div>

          {/* Common Pests */}
          <div>
            <label className={labelCls}>Common Pests</label>
            <input
              type="text"
              value={form.common_pests}
              onChange={(e) => setForm((p) => ({ ...p, common_pests: e.target.value }))}
              placeholder="Rodents, Ants, Cockroaches, Flies"
              className={inputCls}
            />
            <p className="text-[11px] text-gray-400 mt-1">Comma-separated. Stored as JSON array.</p>
          </div>

          {/* Icon & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Icon Name</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                placeholder="e.g. Building2, Coffee, Tag, BookOpen"
                className={inputCls}
              />
              <p className="text-[11px] text-gray-400 mt-1">Lucide icon name.</p>
            </div>
            <div>
              <label className={labelCls}>CTA Button Text</label>
              <input
                type="text"
                value={form.cta_text}
                onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))}
                placeholder="e.g. Request a Plan"
                className={inputCls}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Industry Active</p>
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

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Saving…' : isEdit ? 'Update Industry' : 'Create Industry'}
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

const DeleteDialog = ({ industry, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Industry?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete{' '}
        <span className="font-semibold text-gray-700">"{industry?.name}"</span>. This cannot be undone.
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

export default function IndustriesManager() {
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndustry, setEditingIndustry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchIndustries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllIndustries()
      const data = res.data?.data?.industries || res.data?.industries || (Array.isArray(res.data) ? res.data : [])
      setIndustries(data)
    } catch {
      toast.error('Failed to load industries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIndustries()
  }, [fetchIndustries])

  const handleSave = (savedIndustry, isEdit) => {
    if (isEdit) {
      setIndustries((prev) =>
        prev.map((ind) =>
          ind.id === savedIndustry.id || ind._id === savedIndustry._id ? savedIndustry : ind
        )
      )
    } else {
      setIndustries((prev) => [...prev, savedIndustry])
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteIndustry(deleteTarget.id || deleteTarget._id)
      setIndustries((prev) =>
        prev.filter((ind) => ind.id !== deleteTarget.id && ind._id !== deleteTarget._id)
      )
      toast.success('Industry deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete industry')
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = (industry) => {
    setEditingIndustry(industry)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingIndustry(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingIndustry(null)
  }

  const formatPests = (pestsVal) => {
    try {
      const arr = typeof pestsVal === 'string' ? JSON.parse(pestsVal) : pestsVal
      return Array.isArray(arr) ? arr.join(' • ') : '—'
    } catch {
      return '—'
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Industries</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the industry sectors shown on your website
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchIndustries}
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
            Add Industry
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Name', 'Description', 'Common Pests', 'Icon', 'Status', 'Actions'].map((h) => (
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
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : industries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Building2 size={32} className="text-gray-200" />
                      <p className="text-sm font-medium">No industries found</p>
                      <button
                        onClick={openAdd}
                        className="text-xs text-green-600 hover:text-green-700 font-semibold"
                      >
                        Add your first industry →
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                industries.map((industry, idx) => (
                  <tr key={industry.id || industry._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">
                          {industry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {industry.description || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {formatPests(industry.common_pests)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {industry.icon ? (
                        <code className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-mono">
                          {industry.icon}
                        </code>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          industry.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {industry.active ? (
                          <CheckCircle size={11} />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                        )}
                        {industry.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(industry)}
                          title="Edit industry"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(industry)}
                          title="Delete industry"
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
        {!loading && industries.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {industries.length} industr{industries.length !== 1 ? 'ies' : 'y'} total &bull;{' '}
            {industries.filter((i) => i.active).length} active
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <IndustryModal industry={editingIndustry} onClose={closeModal} onSave={handleSave} />
      )}
      {deleteTarget && (
        <DeleteDialog
          industry={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
