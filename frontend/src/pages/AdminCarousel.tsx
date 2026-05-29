import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface Slide {
  _id: string; badge: string; title: string; highlight: string; desc: string;
  ctaText: string; ctaLink: string; cta2Text: string; cta2Link: string;
  image: string; isActive: boolean; order: number;
  highlightGradient: string;
}

const API = "/api";
const getToken = () => localStorage.getItem("buildyourthoughts_admin_token");

const emptyForm = {
  badge: "", title: "", highlight: "", desc: "",
  ctaText: "Learn More", ctaLink: "/services",
  cta2Text: "Contact Us", cta2Link: "/contact",
  order: "0", highlightGradient: "purple-blue-cyan-orange",
};

// Gradient presets — key stored in DB, value used as CSS gradient
export const GRADIENT_PRESETS: { key: string; label: string; gradient: string }[] = [
  { key: "purple-blue-cyan-orange", label: "Logo Colors",        gradient: "linear-gradient(90deg,#9333ea 0%,#2563eb 30%,#06b6d4 60%,#f97316 100%)" },
  { key: "purple-pink",             label: "Purple → Pink",      gradient: "linear-gradient(90deg,#9333ea 0%,#ec4899 100%)" },
  { key: "blue-cyan",               label: "Blue → Cyan",        gradient: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" },
  { key: "orange-yellow",           label: "Orange → Yellow",    gradient: "linear-gradient(90deg,#f97316 0%,#eab308 100%)" },
  { key: "green-teal",              label: "Green → Teal",       gradient: "linear-gradient(90deg,#16a34a 0%,#06b6d4 100%)" },
  { key: "red-orange",              label: "Red → Orange",       gradient: "linear-gradient(90deg,#dc2626 0%,#f97316 100%)" },
  { key: "pink-purple-blue",        label: "Pink → Purple → Blue", gradient: "linear-gradient(90deg,#ec4899 0%,#9333ea 50%,#2563eb 100%)" },
  { key: "gold-white",              label: "Gold → White",       gradient: "linear-gradient(90deg,#f59e0b 0%,#fef9c3 60%,#ffffff 100%)" },
  { key: "cyan-white",              label: "Cyan → White",       gradient: "linear-gradient(90deg,#06b6d4 0%,#e0f2fe 100%)" },
  { key: "white",                   label: "Pure White",         gradient: "linear-gradient(90deg,#ffffff 0%,#e2e8f0 100%)" },
];

export function getGradientCss(key: string): string {
  return GRADIENT_PRESETS.find(p => p.key === key)?.gradient
    ?? "linear-gradient(90deg,#9333ea 0%,#2563eb 30%,#06b6d4 60%,#f97316 100%)";
}

export default function AdminCarousel() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editSlide, setEditSlide] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetchSlides();
  }, [navigate]);

  const fetchSlides = async () => {
    const res = await fetch(`${API}/carousel/all`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    setSlides(Array.isArray(data) ? data : []);
  };

  const openAdd = () => {
    setEditSlide(null); setForm(emptyForm); setImageFile(null); setImagePreview(""); setError(""); setShowModal(true);
  };

  const openEdit = (s: Slide) => {
    setEditSlide(s);
    setForm({
      badge: s.badge, title: s.title, highlight: s.highlight, desc: s.desc,
      ctaText: s.ctaText, ctaLink: s.ctaLink, cta2Text: s.cta2Text, cta2Link: s.cta2Link,
      order: String(s.order),
      highlightGradient: s.highlightGradient || "purple-blue-cyan-orange",
    });
    setImageFile(null); setImagePreview(s.image || ""); setError(""); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await fetch(`${API}/carousel${editSlide ? `/${editSlide._id}` : ""}`, {
        method: editSlide ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      const saved = await res.json();
      setSlides(prev => editSlide ? prev.map(s => s._id === saved._id ? saved : s) : [...prev, saved]);
      setShowModal(false);
      notifySiteDataUpdated("carousel");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
    setSaving(false);
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`${API}/carousel/${id}/toggle`, { method: "PATCH", headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error("Toggle failed");
      const saved = await res.json();
      setSlides(prev => prev.map(s => s._id === saved._id ? saved : s));
      notifySiteDataUpdated("carousel");
    } catch { alert("Failed to toggle slide."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    const res = await fetch(`${API}/carousel/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    if (res.ok) { setSlides(prev => prev.filter(s => s._id !== id)); notifySiteDataUpdated("carousel"); }
  };

  const selectedGradient = getGradientCss(form.highlightGradient);

  return (
    <div className="admin-page flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Carousel" />

      <main className="lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Carousel Slides</h1>
            <p className="text-gray-400 text-sm mt-1">Manage hero carousel — add, edit, toggle, delete</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-purple-600 text-white text-xs md:text-sm font-bold hover:bg-purple-700 shrink-0">
            + Add Slide
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          {slides.map((s) => (
            <div key={s._id} className={`bg-white rounded-2xl border p-4 md:p-5 transition-all ${s.isActive ? "border-gray-100 shadow-sm" : "border-gray-200 opacity-60"}`}>
              <div className="flex gap-3 md:gap-5 items-start">
                <div className="w-20 h-14 md:w-32 md:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {s.image ? <img src={s.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🖼️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest truncate">{s.badge}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${s.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {s.title}{" "}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{ backgroundImage: getGradientCss(s.highlightGradient), WebkitBackgroundClip: "text" }}
                    >
                      {s.highlight}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2 hidden sm:block">{s.desc}</p>
                  <div className="flex gap-2 mt-2 md:hidden">
                    <button onClick={() => handleToggle(s._id)} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${s.isActive ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"}`}>
                      {s.isActive ? "Stop" : "Start"}
                    </button>
                    <button onClick={() => openEdit(s)} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Del</button>
                  </div>
                </div>
                <div className="hidden md:flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleToggle(s._id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${s.isActive ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                    {s.isActive ? "⏸ Stop" : "▶ Start"}
                  </button>
                  <button onClick={() => openEdit(s)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100">✏️ Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100">🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">{editSlide ? "Edit Slide" : "Add New Slide"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

              <CField label="Badge Text *" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} required placeholder="Welcome to the Future of IT" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CField label="Title *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} required placeholder="Build Your Digital Future" />
                <CField label="Highlight Text *" value={form.highlight} onChange={v => setForm(f => ({ ...f, highlight: v }))} required placeholder="BUILD YOUR THOUGHTS" />
              </div>

              {/* Gradient Picker */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Highlight Colour Combination
                </label>
                {/* Live preview */}
                <div className="mb-3 px-4 py-3 rounded-xl bg-gray-900 text-center">
                  <span
                    className="text-xl font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: selectedGradient, WebkitBackgroundClip: "text" }}
                  >
                    {form.highlight || "PREVIEW TEXT"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, highlightGradient: p.key }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        form.highlightGradient === p.key
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <span
                        className="w-6 h-4 rounded shrink-0"
                        style={{ background: p.gradient }}
                      />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} required rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CField label="CTA Button Text" value={form.ctaText} onChange={v => setForm(f => ({ ...f, ctaText: v }))} placeholder="Learn More" />
                <CField label="CTA Link" value={form.ctaLink} onChange={v => setForm(f => ({ ...f, ctaLink: v }))} placeholder="/services" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CField label="2nd Button Text" value={form.cta2Text} onChange={v => setForm(f => ({ ...f, cta2Text: v }))} placeholder="Contact Us" />
                <CField label="2nd Button Link" value={form.cta2Link} onChange={v => setForm(f => ({ ...f, cta2Link: v }))} placeholder="/contact" />
              </div>
              <CField label="Order" value={form.order} onChange={v => setForm(f => ({ ...f, order: v }))} type="number" />

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Background Image</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-purple-400 transition-colors">
                    {imagePreview ? (
                    <img src={imagePreview} alt="preview" loading="lazy" decoding="async" className="mx-auto max-h-32 rounded-lg object-cover" />
                  ) : (
                    <div className="text-gray-400"><div className="text-3xl mb-1">🖼️</div><div className="text-sm">Click to upload background image</div></div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-60">
                  {saving ? "Saving…" : editSlide ? "Update Slide" : "Create Slide"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const CField = ({ label, value, onChange, required, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white" />
  </div>
);
