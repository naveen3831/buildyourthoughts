import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface ShowcaseItem {
  _id: string;
  image: string;
  label: string;
  color: "primary" | "secondary" | "accent";
  order: number;
  isActive: boolean;
}

const colorOptions = ["primary", "secondary", "accent"] as const;
const emptyForm = { label: "", color: "primary" as const, order: "0", isActive: "true" };

const getToken = () => localStorage.getItem("speshway_admin_token");

export default function AdminPhoneShowcase() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ShowcaseItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetchItems();
  }, [navigate]);

  const apiFetch = async (path: string, opts: RequestInit = {}) => {
    const res = await fetch(`/api${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${getToken()}`, ...((opts.headers as Record<string, string>) || {}) },
    });
    if (res.status === 401) { navigate("/admin"); throw new Error("Unauthorized"); }
    return res;
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/phone-showcase/all");
      if (!res.ok) { setItems([]); setLoading(false); return; }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (item: ShowcaseItem) => {
    setEditItem(item);
    setForm({ label: item.label, color: item.color, order: String(item.order), isActive: String(item.isActive) });
    setImageFile(null);
    setImagePreview(item.image);
    setError("");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem && !imageFile) { setError("Please select an image"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("label", form.label);
      fd.append("color", form.color);
      fd.append("order", form.order);
      fd.append("isActive", form.isActive);
      if (imageFile) fd.append("image", imageFile);

      const res = await apiFetch(
        editItem ? `/phone-showcase/${editItem._id}` : "/phone-showcase",
        { method: editItem ? "PUT" : "POST", body: fd }
      );
      if (!res.ok) {
        let msg = "Failed to save";
        try { const d = await res.json(); msg = d.message || msg; } catch { msg = `Server error (${res.status})`; }
        throw new Error(msg);
      }
      await fetchItems();
      setShowModal(false);
      notifySiteDataUpdated("phones");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this phone showcase image?")) return;
    try {
      await apiFetch(`/phone-showcase/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(i => i._id !== id));
      notifySiteDataUpdated("phones");
    } catch {}
  };

  const colorDot: Record<string, string> = {
    primary: "bg-cyan-500",
    secondary: "bg-teal-500",
    accent: "bg-pink-500",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Phone Showcase" />

      <main className="lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Phone Showcase</h1>
            <p className="text-gray-500 text-sm mt-1">Manage images displayed inside phone mockups</p>
          </div>
          <button onClick={openAdd} className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs md:text-sm hover:bg-cyan-700 shrink-0">
            + Add Image
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-cyan-600 border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📱</div>
            <p className="text-lg font-semibold">No phone showcase images yet</p>
            <p className="text-sm mt-1">Add images to display inside the phone mockups on the home page</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, i) => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Phone frame preview */}
                <div className="relative bg-slate-950 mx-3 mt-3 rounded-2xl overflow-hidden" style={{ aspectRatio: "9/19" }}>
                  <img src={item.image} alt={item.label || `Phone ${i + 1}`}
                    className="w-full h-full object-cover" />
                  {!item.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-red-500 px-2 py-0.5 rounded-full">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colorDot[item.color]}`} />
                    <span className="text-xs font-semibold text-gray-600 capitalize">{item.color}</span>
                    <span className="ml-auto text-xs text-gray-400">#{item.order}</span>
                  </div>
                  {item.label && <p className="text-xs text-gray-500 truncate mb-2">{item.label}</p>}
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(item)}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold hover:bg-cyan-100 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">{editItem ? "Edit" : "Add"} Phone Showcase Image</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>}

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Screenshot / App Image {!editItem && <span className="text-red-500">*</span>}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-400 transition-colors"
                >
                  {imagePreview ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-slate-950 rounded-xl overflow-hidden" style={{ aspectRatio: "9/19" }}>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-500">Click to change image</span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-2">📱</div>
                      <p className="text-sm text-gray-500">Click to upload screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — portrait ratio recommended</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Label (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fitness App, E-Commerce..."
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Glow Color</label>
                <div className="flex gap-3">
                  {colorOptions.map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize border-2 transition-all ${
                        form.color === c ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${colorDot[c]}`} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order & Active */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Visibility</label>
                  <select
                    value={form.isActive}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 disabled:opacity-60">
                  {saving ? "Saving..." : editItem ? "Update" : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
