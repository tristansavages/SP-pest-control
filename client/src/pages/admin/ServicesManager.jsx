import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Bug,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

// ─── Slug helper ──────────────────────────────────────────────────────────────

const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// ─── Active Toggle ─────────────────────────────────────────────────────────────

const ActiveToggle = ({ active, serviceId, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const handleToggle = async () => {
    setLoading(true);
    try {
      await api.put(`/services/${serviceId}`, { active: !active });
      onToggle(serviceId, !active);
      toast.success(`Service ${!active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update service');
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={active ? 'Click to deactivate' : 'Click to activate'}
      className="flex items-center gap-1.5 transition-opacity disabled:opacity-50"
    >
      {active ? (
        <ToggleRight size={22} className="text-green-500" />
      ) : (
        <ToggleLeft size={22} className="text-gray-400" />
      )}
      <span className={`text-xs font-semibold ${active ? 'text-green-600' : 'text-gray-400'}`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </button>
  );
};

// ─── Service Form Modal ───────────────────────────────────────────────────────

const ServiceModal = ({ service, onClose, onSave }) => {
  const isEdit = !!service;
  const [form, setForm] = useState({
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    icon: service?.icon || '',
    active: service?.active !== undefined ? service.active : true,
    display_order: service?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    setSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/services/${service.id || service._id}`, form);
      } else {
        res = await api.post('/services', form);
      }
      onSave(res.data, isEdit);
      toast.success(isEdit ? 'Service updated' : 'Service created');
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update service' : 'Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Service' : 'Add New Service'}
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
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Termite Treatment"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              URL Slug
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">
                /services/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="termite-treatment"
                className="w-full rounded-xl border border-gray-200 pl-[5.5rem] pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Auto-generated from name. Edit if needed.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              placeholder="Describe this pest control service..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Icon Name
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              placeholder="e.g. Bug, Shield, Zap"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Use a Lucide icon name (e.g. "Bug", "Shield", "Zap", "Home").
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
              min={0}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">Lower number appears first.</p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Service Active</p>
              <p className="text-xs text-gray-400">Show this service on the website</p>
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
              {saving ? 'Saving…' : isEdit ? 'Update Service' : 'Create Service'}
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

const DeleteDialog = ({ service, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Service?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete{' '}
        <span className="font-semibold text-gray-700">"{service?.name}"</span>. This cannot be undone.
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
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/all');
      const data = Array.isArray(res.data) ? res.data : res.data?.services || [];
      setServices(data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSave = (savedService, isEdit) => {
    if (isEdit) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === savedService.id || s._id === savedService._id ? savedService : s
        )
      );
    } else {
      setServices((prev) => [...prev, savedService]);
    }
  };

  const handleToggleActive = (id, active) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id || s._id === id ? { ...s, active } : s))
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/services/${deleteTarget.id || deleteTarget._id}`);
      setServices((prev) =>
        prev.filter((s) => s.id !== deleteTarget.id && s._id !== deleteTarget._id)
      );
      toast.success('Service deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Services</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Add, edit and manage pest control services shown on your website
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-green-500/25"
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Name', 'Slug', 'Description', 'Icon', 'Status', 'Order', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Bug size={32} className="text-gray-200" />
                      <p className="text-sm font-medium">No services found</p>
                      <button
                        onClick={openAdd}
                        className="text-xs text-green-600 hover:text-green-700 font-semibold"
                      >
                        Add your first service →
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service, idx) => (
                  <tr
                    key={service.id || service._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Bug size={14} className="text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                        {service.slug || '—'}
                      </code>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {service.description || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {service.icon ? (
                        <code className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-mono">
                          {service.icon}
                        </code>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ActiveToggle
                        active={service.active}
                        serviceId={service.id || service._id}
                        onToggle={handleToggleActive}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <GripVertical size={12} className="text-gray-300" />
                        <span className="text-xs font-mono font-semibold text-gray-700">
                          {service.display_order ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(service)}
                          title="Edit service"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(service)}
                          title="Delete service"
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

        {!loading && services.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {services.length} service{services.length !== 1 ? 's' : ''} total &bull;{' '}
            {services.filter((s) => s.active).length} active
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <ServiceModal
          service={editingService}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          service={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
