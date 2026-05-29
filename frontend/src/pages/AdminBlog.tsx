import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface Post {
  _id: string; title: string; excerpt: string; content: string; tag: string;
  author: string; readTime: string; image: string; status: string; featured: boolean; order: number;
  createdAt: string;
}

const API = "/api";
const getToken = () => localStorage.getItem("buildyourthoughts_admin_token");
const emptyForm = { title: "", excerpt: "", content: "", tag: "Technology", author: "", readTime: "5 min", status: "Published", featured: "false", order: "0" };

const tagOptions = ["Technology", "AI", "Cloud", "Security", "DevOps", "Data", "Strategy", "Mobile", "General"];

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
};

export default function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    const res = await fetch(`${API}/blog/all`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  const openAdd = () => { setEditPost(null); setForm(emptyForm); setImageFile(null); setImagePreview(""); setError(""); setShowModal(true); };

  const openEdit = (p: Post) => {
    setEditPost(p);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, tag: p.tag, author: p.author, readTime: p.readTime, status: p.status, featured: String(p.featured), order: String(p.order) });
    setImageFile(null); setImagePreview(p.image || ""); setError(""); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await fetch(`${API}/blog${editPost ? `/${editPost._id}` : ""}`, {
        method: editPost ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      const saved = await res.json();
      if (editPost) {
        setPosts(prev => prev.map(p => p._id === saved._id ? saved : p));
      } else {
        setPosts(prev => [saved, ...prev]);
      }
      setShowModal(false);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`${API}/blog/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    if (res.ok) {
      setPosts(prev => prev.filter(p => p._id !== id));
      notifySiteDataUpdated("blog");
    }
  };

  const f = (key: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  return (
    <div className="admin-page flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Blog" />

      <main className="lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Blog Posts ({posts.length})</h1>
            <p className="text-gray-400 text-sm mt-1">Create and manage blog articles</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-purple-600 text-white text-xs md:text-sm font-bold hover:bg-purple-700 shrink-0">
            + New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">No blog posts yet.</div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {posts.map(p => (
              <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex gap-3 md:gap-5 items-start">
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="w-16 h-12 md:w-24 md:h-16 rounded-xl object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{p.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                      {p.featured && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-100 text-yellow-700 shrink-0">⭐</span>}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-1.5">{p.excerpt}</p>
                    <div className="flex gap-2 text-[10px] text-gray-400 flex-wrap">
                      <span>✍️ {p.author}</span>
                      <span>⏱ {p.readTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">{editPost ? "Edit Post" : "New Blog Post"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

              <BField label="Title *" value={form.title} onChange={f("title")} required />
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Excerpt *</label>
                <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} required rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Content</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={5}
                  placeholder="Write the full blog post content here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tag / Category</label>
                  <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white">
                    {tagOptions.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white">
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BField label="Author" value={form.author} onChange={f("author")} placeholder="Rajesh K." />
                <BField label="Read Time" value={form.readTime} onChange={f("readTime")} placeholder="5 min" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured === "true"} onChange={e => setForm(p => ({ ...p, featured: String(e.target.checked) }))} className="w-4 h-4 accent-purple-600" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Post</label>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cover Image</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-cyan-400 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" loading="lazy" decoding="async" className="mx-auto max-h-32 rounded-lg object-cover" />
                  ) : (
                    <div className="text-gray-400"><div className="text-3xl mb-1">🖼️</div><div className="text-sm">Click to upload cover image</div></div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-60">
                  {saving ? "Saving…" : editPost ? "Update Post" : "Publish Post"}
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

const BField = ({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white" />
  </div>
);
