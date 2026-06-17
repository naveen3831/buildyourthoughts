import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { adminFetch, clearAdminSession, getToken } from "@/lib/adminFetch";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface Member {
  _id: string; name: string; role: string; bio: string; initials: string;
  gradient: string; linkedin: string; github: string; twitter: string;
  email: string; image: string; order: number; isActive: boolean;
}

const emptyForm = { name: "", role: "", bio: "", initials: "", gradient: "from-cyan-500 to-pink-500", linkedin: "", github: "", twitter: "", email: "", order: "0" };

const gradients = [
  "from-cyan-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-cyan-500",
  "from-pink-500 to-rose-500",
];

export default function AdminTeam() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetchMembers();
  }, [navigate]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/team/all", {}, () => navigate("/admin", { replace: true }));
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      setMembers([]);
    }
    setLoading(false);
  };

  const openAdd = () => { setEditMember(null); setForm(emptyForm); setImageFile(null); setImagePreview(""); setError(""); setShowModal(true); };

  const openEdit = (m: Member) => {
    setEditMember(m);
    setForm({ name: m.name, role: m.role, bio: m.bio, initials: m.initials, gradient: m.gradient, linkedin: m.linkedin, github: m.github, twitter: m.twitter, email: m.email, order: String(m.order) });
    setImageFile(null); setImagePreview(m.image || ""); setError(""); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const res = await adminFetch(
        editMember ? `/team/${editMember._id}` : "/team",
        { method: editMember ? "PUT" : "POST", body: fd },
        () => navigate("/admin", { replace: true })
      );
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      const saved = await res.json();
      if (editMember) {
        setMembers(prev => prev.map(m => m._id === saved._id ? saved : m));
      } else {
        setMembers(prev => [...prev, saved]);
      }
      setShowModal(false);
      notifySiteDataUpdated("team");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const res = await adminFetch(`/team/${id}`, { method: "DELETE" }, () => navigate("/admin", { replace: true }));
    if (res.ok) {
      setMembers(prev => prev.filter(m => m._id !== id));
      notifySiteDataUpdated("team");
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const fd = new FormData();
      fd.append("isActive", String(!currentActive));
      const res = await adminFetch(`/team/${id}`, { method: "PUT", body: fd }, () => navigate("/admin", { replace: true }));
      if (res.ok) {
        const saved = await res.json();
        setMembers(prev => prev.map(m => m._id === saved._id ? saved : m));
      }
    } catch { /* silent */ }
  };

  const f = (key: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  return (
    <div className="admin-page flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Team" />

      <main className="md:ml-56 lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Team Members ({members.length})</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your team — changes reflect on the Team page</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-purple-600 text-white text-xs md:text-sm font-bold hover:bg-purple-700 shrink-0">
            + Add Member
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading team members…</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold">No team members yet.</p>
            <p className="text-sm mt-1">Click "Add Team Member" to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map(m => (
              <div key={m._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!m.isActive ? "border-gray-300 bg-gray-50" : "border-gray-100"}`}>
                <div className="flex items-center gap-4 mb-4">
                  {m.image ? (
                    <img src={m.image} alt={m.name} loading="lazy" decoding="async" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white font-black text-lg`}>
                      {m.initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 truncate">{m.name}</h3>
                      {!m.isActive && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 shrink-0">Hidden</span>}
                    </div>
                    <p className="text-purple-600 text-xs font-bold uppercase tracking-wider">{m.role}</p>
                  </div>
                </div>
                {m.bio && <p className="text-gray-500 text-xs line-clamp-2 mb-4">{m.bio}</p>}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                  <button onClick={() => handleToggle(m._id, m.isActive)} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${m.isActive ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                    {m.isActive ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
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
              <h2 className="text-lg font-black text-gray-900">{editMember ? "Edit Member" : "Add Team Member"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TField label="Full Name *" value={form.name} onChange={f("name")} required />
                <TField label="Role / Title *" value={form.role} onChange={f("role")} required placeholder="CEO & Founder" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TField label="Initials (e.g. RK)" value={form.initials} onChange={f("initials")} placeholder="Auto-generated" />
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Avatar Gradient</label>
                  <select value={form.gradient} onChange={e => setForm(p => ({ ...p, gradient: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white">
                    {gradients.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TField label="LinkedIn URL" value={form.linkedin} onChange={f("linkedin")} placeholder="https://linkedin.com/in/..." />
                <TField label="GitHub URL" value={form.github} onChange={f("github")} placeholder="https://github.com/..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TField label="Twitter URL" value={form.twitter} onChange={f("twitter")} placeholder="https://twitter.com/..." />
                <TField label="Email" value={form.email} onChange={f("email")} placeholder="name@buildyourthoughts.com" />
              </div>
              <TField label="Display Order" value={form.order} onChange={f("order")} type="number" />

              {/* Photo upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Profile Photo</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-cyan-400 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" loading="lazy" decoding="async" className="w-25 h-25 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="text-gray-400"><div className="text-3xl mb-1">📷</div><div className="text-sm">Click to upload photo</div><div className="text-xs mt-1">PNG, JPG, WEBP (Max 5MB)</div></div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-60">
                  {saving ? "Saving…" : editMember ? "Update Member" : "Add Member"}
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

const TField = ({ label, value, onChange, required, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white" />
  </div>
);
