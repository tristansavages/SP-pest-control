import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  ExternalLink,
  ArrowUpRight,
  RefreshCw,
  Layers,
  PhoneCall,
} from 'lucide-react';
import api from '../../utils/api';
import { openWhatsApp } from '../../utils/whatsapp';

// ─── Skeleton loaders ────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
      </td>
    ))}
  </tr>
);

// ─── Badge helpers ────────────────────────────────────────────────────────────

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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon: Icon, borderColor, iconBg, iconColor, subtext }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 ${borderColor} hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 leading-none">{value ?? '—'}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1.5">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
    </div>
  </div>
);

// ─── Booking Detail Modal ─────────────────────────────────────────────────────

const BookingModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Name</p>
              <p className="text-sm font-semibold text-gray-800">{booking.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Phone</p>
              <p className="text-sm font-semibold text-gray-800">{booking.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-800">{booking.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Property</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">{booking.property_type || '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Address</p>
            <p className="text-sm font-semibold text-gray-800">{booking.address || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Pest Problem</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{booking.pest_problem}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Urgency</p>
              <UrgencyBadge urgency={booking.urgency} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Status</p>
              <StatusBadge status={booking.status} />
            </div>
          </div>
          {booking.phone && (
            <button
              onClick={() => openWhatsApp(booking.phone, `Hi ${booking.name}, thank you for your enquiry with JB Pest Control regarding "${booking.pest_problem}". We'll be in touch shortly!`)}
              className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
            >
              <ExternalLink size={15} />
              Open WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bookings?limit=8&sort=created_at&order=desc'),
      ]);
      setStats(statsRes.data);
      const bookingsData = Array.isArray(bookingsRes.data)
        ? bookingsRes.data
        : bookingsRes.data?.bookings || [];
      setRecentBookings(bookingsData.slice(0, 8));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpiCards = [
    {
      label: 'Total Bookings',
      value: stats?.total_bookings,
      icon: BookOpen,
      borderColor: 'border-l-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtext: 'All time',
    },
    {
      label: 'New Bookings',
      value: stats?.new_bookings,
      icon: Plus,
      borderColor: 'border-l-green-500',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      subtext: 'Pending response',
    },
    {
      label: 'Completed',
      value: stats?.completed_bookings,
      icon: CheckCircle,
      borderColor: 'border-l-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtext: 'Successfully closed',
    },
    {
      label: 'Urgent',
      value: stats?.urgent_bookings,
      icon: AlertTriangle,
      borderColor: 'border-l-red-500',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      subtext: 'Needs immediate attention',
    },
    {
      label: 'Unread Messages',
      value: stats?.unread_messages,
      icon: MessageSquare,
      borderColor: 'border-l-purple-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtext: 'WhatsApp enquiries',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back — here's what's happening at JB Pest Control.
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {loading
          ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((card) => <KpiCard key={card.label} {...card} />)}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Booking Requests</h3>
            <p className="text-xs text-gray-500 mt-0.5">Latest 8 bookings</p>
          </div>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            View All
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Name', 'Phone', 'Pest Problem', 'Date', 'Urgency', 'Status', 'Actions'].map(
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
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr
                    key={booking.id || booking._id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800 text-sm">{booking.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{booking.phone}</td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="text-gray-700 text-xs line-clamp-2">{booking.pest_problem}</span>
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
                      <StatusBadge status={booking.status || 'new'} />
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
                        {booking.phone && (
                          <button
                            onClick={() =>
                              openWhatsApp(
                                booking.phone,
                                `Hi ${booking.name}, thank you for contacting JB Pest Control!`
                              )
                            }
                            title="Open WhatsApp"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 transition-colors"
                          >
                            <PhoneCall size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Layers size={22} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              Active Services
            </p>
            <p className="text-2xl font-black text-gray-900">
              {stats?.active_services ?? '—'}
            </p>
            <p className="text-xs text-gray-400">Currently listed on website</p>
          </div>
          <Link
            to="/admin/services"
            className="ml-auto text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              WhatsApp Enquiries
            </p>
            <p className="text-2xl font-black text-gray-900">
              {stats?.whatsapp_enquiries ?? '—'}
            </p>
            <p className="text-xs text-gray-400">Total via WhatsApp</p>
          </div>
          <Link
            to="/admin/bookings"
            className="ml-auto text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}
