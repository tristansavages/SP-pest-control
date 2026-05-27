import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  CheckCircle,
  RefreshCw,
  Globe,
  Phone,
  MessageCircle,
  FileText,
  Info,
  Megaphone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

// ─── Content field config ─────────────────────────────────────────────────────

const contentSections = [
  {
    key: 'hero',
    title: 'Hero Section',
    description: 'The main headline and subheadline shown at the top of your homepage.',
    icon: Globe,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accentColor: 'border-l-blue-500',
    fields: [
      {
        key: 'hero_headline',
        label: 'Hero Headline',
        type: 'text',
        placeholder: 'e.g. Professional Pest Control in Cape Town',
      },
      {
        key: 'hero_subheadline',
        label: 'Hero Subheadline',
        type: 'textarea',
        rows: 3,
        placeholder: 'e.g. Fast, reliable and eco-friendly pest control solutions for your home and business.',
      },
    ],
  },
  {
    key: 'contact',
    title: 'Contact Information',
    description: 'Phone number, physical address, and operating hours.',
    icon: Phone,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    accentColor: 'border-l-green-500',
    fields: [
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'e.g. 064 123 4567',
      },
      {
        key: 'address',
        label: 'Address',
        type: 'text',
        placeholder: 'e.g. Cape Town, Western Cape, South Africa',
      },
      {
        key: 'operating_hours',
        label: 'Operating Hours',
        type: 'text',
        placeholder: 'e.g. Mon–Fri: 07:00–18:00 | Sat: 08:00–14:00',
      },
    ],
  },
  {
    key: 'about',
    title: 'About Section',
    description: "Text about your business shown in the About section.",
    icon: Info,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    accentColor: 'border-l-purple-500',
    fields: [
      {
        key: 'about_text',
        label: 'About Text',
        type: 'textarea',
        rows: 6,
        placeholder: 'Tell customers about SP Pest Control — your experience, values, and commitment...',
      },
    ],
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp Settings',
    description: 'Configure the default WhatsApp number and pre-filled message.',
    icon: MessageCircle,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    accentColor: 'border-l-emerald-500',
    fields: [
      {
        key: 'whatsapp_number',
        label: 'WhatsApp Number',
        type: 'text',
        placeholder: 'e.g. 27641234567 (no spaces, include country code)',
      },
      {
        key: 'whatsapp_message',
        label: 'Default WhatsApp Message',
        type: 'textarea',
        rows: 3,
        placeholder: 'e.g. Hi SP Pest Control! I need help with a pest problem. Can you assist?',
      },
    ],
  },
  {
    key: 'ctas',
    title: 'Call to Action Buttons',
    description: 'Text for the primary and secondary call-to-action buttons.',
    icon: Megaphone,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    accentColor: 'border-l-orange-500',
    fields: [
      {
        key: 'cta_primary',
        label: 'Primary CTA Text',
        type: 'text',
        placeholder: 'e.g. Book a Free Inspection',
      },
      {
        key: 'cta_secondary',
        label: 'Secondary CTA Text',
        type: 'text',
        placeholder: 'e.g. Chat on WhatsApp',
      },
    ],
  },
];

// ─── Single Field Editor ──────────────────────────────────────────────────────

const FieldEditor = ({ fieldKey, label, type, placeholder, rows, value, onChange, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(fieldKey, value);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {savedFeedback && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 animate-in fade-in duration-200">
            <CheckCircle size={12} />
            Saved!
          </span>
        )}
      </div>

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          rows={rows || 3}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      )}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <Save size={12} />
          )}
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonSection = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="space-y-1.5">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-56" />
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-xl w-full" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContentManager() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/content');
      // Normalise: API may return array of {key, value} or an object
      const raw = res.data;
      if (Array.isArray(raw)) {
        const mapped = {};
        raw.forEach((item) => {
          mapped[item.key] = item.value;
        });
        setContent(mapped);
      } else {
        setContent(raw || {});
      }
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleChange = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key, value) => {
    try {
      await api.put(`/content/${key}`, { value });
      toast.success(`"${key}" saved successfully`);
    } catch {
      toast.error(`Failed to save "${key}"`);
      throw new Error('save failed');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Website Content</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit the text and content displayed on your website
          </p>
        </div>
        <button
          onClick={() => fetchContent()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Changes are saved individually per field. Click the{' '}
          <strong>Save</strong> button next to each field to update it on your website.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {loading
          ? [...Array(5)].map((_, i) => <SkeletonSection key={i} />)
          : contentSections.map(
              ({ key, title, description, icon: Icon, iconBg, iconColor, accentColor, fields }) => (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 ${accentColor} overflow-hidden`}
                >
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        <Icon size={18} className={iconColor} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="px-6 py-5 space-y-5">
                    {fields.map((field) => (
                      <FieldEditor
                        key={field.key}
                        fieldKey={field.key}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        rows={field.rows}
                        value={content[field.key] || ''}
                        onChange={handleChange}
                        onSave={handleSave}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
      </div>
    </div>
  );
}
