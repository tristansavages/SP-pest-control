import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Star,
  Pencil,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Quote,
  MapPin,
  User,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

// ─── Star Rating Input ────────────────────────────────────────────────────────

const StarRatingInput = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110 active:scale-95"
      >
        <Star
          size={24}
          className={`transition-colors ${
            star <= value
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ))}
    <span className="ml-2 text-xs text-gray-500 font-semibold">
      {value > 0 ? `${value}/5` : 'Select rating'}
    </span>
  </div>
);

// ─── Star Display ─────────────────────────────────────────────────────────────

const StarDisplay = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
  </div>
);

// ─── Testimonial Modal ────────────────────────────────────────────────────────

const TestimonialModal = ({ testimonial, onClose, onSave }) => {
  const isEdit = !!testimonial;
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    location: testimonial?.location || '',
    rating: testimonial?.rating || 5,
    review: testimonial?.review || '',
    active: testimonial?.active !== undefined ? testimonial.active : true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.review.trim()) {
      toast.error('Review text is required');
      return;
    }
    if (form.rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    setSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/testimonials/${testimonial.id || testimonial._id}`, form);
      } else {
        res = await api.post('/testimonials', form);
      }
      onSave(res.data, isEdit);
      toast.success(isEdit ? 'Testimonial updated' : 'Testimonial added');
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update testimonial' : 'Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sarah M."
                required
                className="w-full pl-9 pr-4 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Cape Town, Western Cape"
                className="w-full pl-9 pr-4 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Star Rating <span className="text-red-500">*</span>
            </label>
            <StarRatingInput value={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} />
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Review Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.review}
              onChange={(e) => setForm((p) => ({ ...p, review: e.target.value }))}
              rows={5}
              required
              placeholder="What did the customer say about JB Pest Control?"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {form.review.length} characters
            </p>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Show on Website</p>
              <p className="text-xs text-gray-400">Display this testimonial publicly</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
            >
              {form.active ? (
                <ToggleRight size={28} className="text-green-500" />
              ) : (
                <ToggleLeft size={28} className="text-gray-400" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Saving…' : isEdit ? 'Update Testimonial' : 'Add Testimonial'}
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
  );
};

// ─── Delete Dialog ────────────────────────────────────────────────────────────

const DeleteDialog = ({ testimonial, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Testimonial?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete the review from{' '}
        <span className="font-semibold text-gray-700">{testimonial?.name}</span>. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Testimonial Card ─────────────────────────────────────────────────────────

const TestimonialCard = ({ testimonial, onEdit, onDelete, onToggleActive }) => {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggleActive(testimonial.id || testimonial._id, !testimonial.active);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col transition-all duration-200 hover:shadow-md ${
        testimonial.active ? 'border-gray-100' : 'border-gray-100 opacity-60'
      }`}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow">
              <span className="text-white font-bold text-sm">
                {(testimonial.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
              {testimonial.location && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={10} />
                  {testimonial.location}
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              testimonial.active
                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {testimonial.active ? 'Active' : 'Hidden'}
          </span>
        </div>

        {/* Stars */}
        <div className="mt-3">
          <StarDisplay rating={testimonial.rating} size={15} />
        </div>
      </div>

      {/* Review Text */}
      <div className="px-5 py-3 flex-1">
        <div className="relative">
          <Quote size={16} className="text-green-200 mb-1.5" />
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            {testimonial.review}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
        <button
          onClick={() => onEdit(testimonial)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 text-xs font-semibold transition-colors"
        >
          <Pencil size={12} />
          Edit
        </button>
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={testimonial.active ? 'Hide testimonial' : 'Show testimonial'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-yellow-100 hover:text-yellow-700 text-gray-600 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {testimonial.active ? <EyeOff size={12} /> : <Eye size={12} />}
          {testimonial.active ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={() => onDelete(testimonial)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 text-xs font-semibold transition-colors ml-auto"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/all');
      const data = Array.isArray(res.data) ? res.data : res.data?.testimonials || [];
      setTestimonials(data);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSave = (saved, isEdit) => {
    if (isEdit) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === saved.id || t._id === saved._id ? saved : t
        )
      );
    } else {
      setTestimonials((prev) => [saved, ...prev]);
    }
  };

  const handleToggleActive = async (id, active) => {
    try {
      await api.put(`/testimonials/${id}`, { active });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, active } : t))
      );
      toast.success(`Testimonial ${active ? 'shown' : 'hidden'}`);
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/testimonials/${deleteTarget.id || deleteTarget._id}`);
      setTestimonials((prev) =>
        prev.filter((t) => t.id !== deleteTarget.id && t._id !== deleteTarget._id)
      );
      toast.success('Testimonial deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (t) => {
    setEditingTestimonial(t);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingTestimonial(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
  };

  const activeCount = testimonials.filter((t) => t.active).length;
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : '—';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Testimonials / Reviews</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage customer reviews displayed on your website
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-green-500/25"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Quote size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">Total:</span>
          <span className="text-sm font-black text-gray-900">{testimonials.length}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
          <Eye size={14} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Visible:</span>
          <span className="text-sm font-black text-green-800">{activeCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-200">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold text-yellow-700">Avg Rating:</span>
          <span className="text-sm font-black text-yellow-800">{avgRating}</span>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-28" />
                  <div className="h-2.5 bg-gray-200 rounded w-20" />
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((__, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Star size={48} className="text-gray-200" />
            <p className="text-base font-semibold">No testimonials yet</p>
            <p className="text-sm">Add your first customer review using the button above.</p>
            <button
              onClick={openAdd}
              className="mt-2 text-xs text-green-600 hover:text-green-700 font-semibold"
            >
              Add a testimonial →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id || testimonial._id}
              testimonial={testimonial}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <TestimonialModal
          testimonial={editingTestimonial}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          testimonial={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
