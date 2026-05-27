import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  X,
  Pencil,
  Trash2,
  Star,
  Image as ImageIcon,
  CloudUpload,
  Save,
  CheckCircle,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const API_BASE = 'http://localhost:5000';

// ─── Image URL helper ─────────────────────────────────────────────────────────

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE}/uploads/${filename}`;
};

// ─── Upload Zone ──────────────────────────────────────────────────────────────

const UploadZone = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) handleFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setAltText('');
    setFeatured(false);
    setDisplayOrder(0);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('alt_text', altText);
    formData.append('featured', featured);
    formData.append('display_order', displayOrder);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      toast.success('Image uploaded successfully');
      onUploadSuccess(res.data);
      clearFile();
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <CloudUpload size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Upload New Image</h3>
          <p className="text-xs text-gray-500">Add images to your gallery — JPG, PNG, WebP supported</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Drop Zone */}
        <div>
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all h-52 ${
                dragging
                  ? 'border-green-400 bg-green-50 scale-[1.01]'
                  : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'
              }`}
            >
              <Upload size={32} className={dragging ? 'text-green-500' : 'text-gray-300'} />
              <p className="mt-3 text-sm font-semibold text-gray-600">
                {dragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden h-52 bg-gray-100">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <X size={13} />
              </button>
              <div className="absolute bottom-2 left-2">
                <span className="bg-black/60 text-white text-[11px] px-2 py-1 rounded-lg font-medium">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Image Details */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Featured</label>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className="flex items-center gap-2 h-10 w-full px-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-sm"
              >
                {featured ? (
                  <ToggleRight size={20} className="text-yellow-500" />
                ) : (
                  <ToggleLeft size={20} className="text-gray-400" />
                )}
                <span className={`text-xs font-semibold ${featured ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {featured ? 'Featured' : 'Normal'}
                </span>
              </button>
            </div>
          </div>

          {/* Upload button + progress */}
          <div>
            {uploading && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={15} />
              {uploading ? `Uploading ${progress}%…` : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const EditModal = ({ image, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: image?.title || '',
    alt_text: image?.alt_text || '',
    featured: image?.featured || false,
    display_order: image?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/gallery/${image.id || image._id}`, form);
      onSave(res.data || { ...(image), ...form });
      toast.success('Image updated');
      onClose();
    } catch {
      toast.error('Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Edit Image</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 pt-4">
          <div className="rounded-xl overflow-hidden h-40 bg-gray-100 mb-4">
            {image.filename && (
              <img
                src={getImageUrl(image.filename)}
                alt={image.alt_text}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Image title"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alt Text</label>
            <input
              type="text"
              value={form.alt_text}
              onChange={(e) => setForm((p) => ({ ...p, alt_text: e.target.value }))}
              placeholder="Descriptive alt text"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                min={0}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Featured</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                className="flex items-center gap-2 h-10 w-full px-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {form.featured ? (
                  <ToggleRight size={20} className="text-yellow-500" />
                ) : (
                  <ToggleLeft size={20} className="text-gray-400" />
                )}
                <span className={`text-xs font-semibold ${form.featured ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {form.featured ? 'Featured' : 'Normal'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving…' : 'Save Changes'}
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

const DeleteDialog = ({ image, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Image?</h3>
      <p className="text-sm text-gray-500 text-center mb-5">
        This will permanently delete{' '}
        <span className="font-semibold text-gray-700">"{image?.title || 'this image'}"</span>. This cannot be undone.
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

// ─── Gallery Card ─────────────────────────────────────────────────────────────

const GalleryCard = ({ image, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imgError && image.filename ? (
          <img
            src={getImageUrl(image.filename)}
            alt={image.alt_text || image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <ImageIcon size={36} />
            <p className="text-xs mt-2 text-gray-400">No preview</p>
          </div>
        )}

        {/* Featured badge */}
        {image.featured && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              <Star size={10} fill="currentColor" />
              Featured
            </span>
          </div>
        )}

        {/* Action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(image)}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-blue-600 shadow-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(image)}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-red-600 shadow-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {image.title || 'Untitled'}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {image.alt_text || 'No alt text'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-gray-400 font-mono">
            Order: {image.display_order ?? 0}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(image)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
            <span className="text-gray-200">·</span>
            <button
              onClick={() => onDelete(image)}
              className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      const data = Array.isArray(res.data) ? res.data : res.data?.images || [];
      setImages(data);
    } catch {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUploadSuccess = (newImage) => {
    setImages((prev) => [newImage, ...prev]);
  };

  const handleSaveEdit = (updated) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === updated.id || img._id === updated._id ? { ...img, ...updated } : img
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteTarget.id || deleteTarget._id}`);
      setImages((prev) =>
        prev.filter((img) => img.id !== deleteTarget.id && img._id !== deleteTarget._id)
      );
      toast.success('Image deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gallery Images</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload and manage images shown in your gallery
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ImageIcon size={15} />
          <span className="font-semibold">{images.length}</span> images
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="px-3 py-2.5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <ImageIcon size={48} className="text-gray-200" />
            <p className="text-base font-semibold">No images yet</p>
            <p className="text-sm">Upload your first image using the form above.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <GalleryCard
              key={image.id || image._id}
              image={image}
              onEdit={setEditingImage}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editingImage && (
        <EditModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          image={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
