import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  MessageCircle,
  X,
  Save,
  CheckSquare,
  Square,
  ChevronDown,
  AlertTriangle,
  Users,
  Inbox,
  Zap,
  PhoneCall,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { openWhatsApp, buildWhatsAppUrl } from '../../utils/whatsapp';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['new', 'contacted', 'scheduled', 'completed', 'cancelled'];

const statusConfig = {
  new: { label: 'New', classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  contacted: { label: 'Contacted', classes: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' },
  scheduled: { label: 'Scheduled', classes: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  completed: { label: 'Completed', classes: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
};

const urgencyConfig = {
  normal: { label: 'Normal', classes: 'bg-gray-100 text-gray-600' },
  urgent: { label: 'Urgent', classes: 'bg-orange-100 text-orange-700' },
  emergency: { label: 'Emergency', classes: 'bg-red-100 text-red-700' },
};

// ─── Badges ───────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.new;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};

const UrgencyBadge = ({ urgency }) => {
  const cfg = urgencyConfig[urgency] || urgencyConfig.normal;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};

// ─── Status Dropdown ──────────────────────────────────────────────────────────

const StatusDropdown = ({ currentStatus, bookingId, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return; }
    setUpdating(true);
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      onUpdate(bookingId, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        className="flex items-center gap-1.5 disabled:opacity-50"
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown size={11} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  s === currentStatus ? 'font-semibold' : ''
                }`}
              >
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Booking Detail Modal ─────────────────────────────────────────────────────

const BookingModal = ({ booking, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(booking.internal_notes || '');
  const [status, setStatus] = useState(booking.status || 'new');
  const [whatsappSent, setWhatsappSent] = useState(booking.whatsapp_sent || false);
  const [saving, setSaving] = useState(false);

  if (!booking) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/bookings/${booking.id || booking._id}`, {
        internal_notes: notes,
        status,
        whatsapp_sent: whatsappSent,
      });
      onUpdate(booking.id || booking._id, { internal_notes: notes, status, whatsapp_sent: whatsappSent });
      toast.success('Booking updated successfully');
      onClose();
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleWhatsApp = () => {
    openWhatsApp(
      buildWhatsAppUrl(
        `Hi ${booking.full_name}, this is SP Pest Control following up on your enquiry.`
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
            <p className="text-xs text-gray-500">ID: {booking.id || booking._id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Customer Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: booking.full_name },
              { label: 'Phone', value: booking.phone },
              { label: 'Email', value: booking.email || '—' },
              { label: 'Customer Type', value: booking.customer_type || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Service Category */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Service Type</p>
            <p className="text-sm font-semibold text-gray-800">{booking.service_category || 'Once-Off Service'}</p>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Address</p>
            <p className="text-sm font-semibold text-gray-800">{booking.address || '—'}</p>
          </div>

          {/* Pest Problem */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Pest Problem</p>
            <p className="text-sm text-gray-700 leading-relaxed">{booking.pest_problem}</p>
          </div>

          {/* Preferred Date + Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Preferred Date</p>
              <p className="text-sm font-semibold text-gray-800">
                {booking.preferred_date
                  ? new Date(booking.preferred_date).toLocaleDateString('en-ZA', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Urgency</p>
              <UrgencyBadge urgency={booking.urgency || 'normal'} />
            </div>
          </div>

          {/* Status Change */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Update Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    status === s
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Internal Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes, follow-up details, or reminders..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
            />
          </div>

          {/* WhatsApp Sent Checkbox */}
          <button
            onClick={() => setWhatsappSent(!whatsappSent)}
            className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            {whatsappSent ? (
              <CheckSquare size={18} className="text-green-500" />
            ) : (
              <Square size={18} className="text-gray-400" />
            )}
            <span className="font-medium">Mark WhatsApp message as sent</span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle size={15} />
              Open WhatsApp
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors disabled:opacity-50 ml-auto"
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

const DeleteDialog = ({ booking, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Booking?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete the booking from{' '}
        <span className="font-semibold text-gray-700">{booking?.full_name}</span>. This cannot be undone.
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

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      const data = Array.isArray(res.data) ? res.data : res.data?.bookings || [];
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdate = (id, updates) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id || b._id === id ? { ...b, ...updates } : b))
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/bookings/${deleteTarget.id || deleteTarget._id}`);
      setBookings((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id && b._id !== deleteTarget._id)
      );
      toast.success('Booking deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const searchLower = search.toLowerCase();
    const matchSearch =
      !search ||
      b.full_name?.toLowerCase().includes(searchLower) ||
      b.phone?.toLowerCase().includes(searchLower) ||
      b.email?.toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  });

  const total = bookings.length;
  const newCount = bookings.filter((b) => b.status === 'new').length;
  const urgentCount = bookings.filter((b) => b.urgency === 'urgent' || b.urgency === 'emergency').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Booking Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage all customer booking enquiries</p>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Users size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">Total:</span>
          <span className="text-sm font-black text-gray-900">{total}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
          <Inbox size={14} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">New:</span>
          <span className="text-sm font-black text-blue-800">{newCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-200">
          <Zap size={14} className="text-red-600" />
          <span className="text-xs font-semibold text-red-700">Urgent:</span>
          <span className="text-sm font-black text-red-800">{urgentCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Name', 'Phone', 'Email', 'Address', 'Pest Problem', 'Customer Type', 'Date/Time', 'Urgency', 'Status', 'Actions'].map(
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
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(11)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertTriangle size={32} className="text-gray-200" />
                      <p className="text-sm font-medium">No bookings found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((booking, idx) => (
                  <tr
                    key={booking.id || booking._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800 whitespace-nowrap">{booking.full_name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{booking.phone}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">
                      {booking.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">
                      {booking.address || '—'}
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="text-gray-700 text-xs line-clamp-2">{booking.pest_problem}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize whitespace-nowrap">
                      {booking.customer_type || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {booking.preferred_date
                        ? new Date(booking.preferred_date).toLocaleDateString('en-ZA', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : booking.created_at
                        ? new Date(booking.created_at).toLocaleDateString('en-ZA', {
                            day: '2-digit',
                            month: 'short',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <UrgencyBadge urgency={booking.urgency || 'normal'} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusDropdown
                        currentStatus={booking.status || 'new'}
                        bookingId={booking.id || booking._id}
                        onUpdate={handleUpdate}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          title="View details"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() =>
                            openWhatsApp(
                              buildWhatsAppUrl(
                                `Hi ${booking.full_name}, this is SP Pest Control following up on your enquiry.`
                              )
                            )
                          }
                          title="Open WhatsApp"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 transition-colors"
                        >
                          <PhoneCall size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(booking)}
                          title="Delete booking"
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

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {total} bookings
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdate}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          booking={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
