import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { notifySiteDataUpdated } from "@/lib/siteData";

interface Job {
  _id: string; title: string; location: string; type: string; salary: string;
  department: string; experience: string; desc: string; requirements: string[];
  status: string; order: number;
}

interface Application {
  _id: string; jobTitle: string; name: string; email: string; phone: string;
  coverLetter: string; resumeUrl: string; resumeOriginalName: string;
  status: string; createdAt: string;
}

const API = "/api";
const getToken = () => localStorage.getItem("buildyourthoughts_admin_token");
const emptyForm = {
  title: "", location: "", type: "Full-time", salary: "",
  department: "", experience: "", desc: "", requirements: "", status: "Open", order: "0",
};

const statusColors: Record<string, string> = {
  Open: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
};

const appStatusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Reviewed: "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminJobs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"jobs" | "applications">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) return navigate("/admin", { replace: true });
    fetchJobs();
    fetchApplications();
  }, [navigate]);

  const fetchJobs = async () => {
    const res = await fetch(`${API}/jobs/all`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  const fetchApplications = async () => {
    const res = await fetch(`${API}/jobs/applications/all`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
  };

  const updateAppStatus = async (appId: string, status: string) => {
    await fetch(`${API}/jobs/applications/${appId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
  };

  const openAdd = () => {
    setEditJob(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (j: Job) => {
    setEditJob(j);
    setForm({
      title: j.title, location: j.location, type: j.type, salary: j.salary,
      department: j.department, experience: j.experience, desc: j.desc,
      requirements: j.requirements.join("\n"), status: j.status, order: String(j.order),
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/jobs${editJob ? `/${editJob._id}` : ""}`, {
        method: editJob ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message);
      }
      const saved = await res.json();
      if (editJob) {
        setJobs(prev => prev.map(j => j._id === saved._id ? saved : j));
      } else {
        setJobs(prev => [...prev, saved]);
      }
      setShowModal(false);
      notifySiteDataUpdated("jobs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`${API}/jobs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    if (res.ok) {
      setJobs(prev => prev.filter(j => j._id !== id));
      notifySiteDataUpdated("jobs");
    }
  };

  const f = (key: keyof typeof emptyForm) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  return (
    <div className="admin-page flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar active="Jobs" />

      <main className="lg:ml-56 flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">Jobs & Applications</h1>
            <p className="text-gray-400 text-sm mt-1">Manage job postings and review applicants</p>
          </div>
          {tab === "jobs" && (
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-purple-600 text-white text-xs md:text-sm font-bold hover:bg-purple-700 shrink-0">
              + Add Job
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("jobs")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${tab === "jobs" ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            Job Postings ({jobs.length})
          </button>
          <button onClick={() => setTab("applications")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${tab === "applications" ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            Applications ({applications.length})
          </button>
        </div>

        {/* Jobs Tab */}
        {tab === "jobs" && (
          jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">No jobs yet. Add your first posting!</div>
          ) : (
              <div className="space-y-3 md:space-y-4">
              {jobs.map(j => (
                <div key={j._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 text-base">{j.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${statusColors[j.status] || "bg-gray-100 text-gray-600"}`}>{j.status}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-purple-600 font-bold shrink-0">
                            {applications.filter(a => a.jobTitle === j.title).length} applicants
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-4 text-xs text-gray-500">
                          {j.location && <span>📍 {j.location}</span>}
                          {j.type && <span>⏱ {j.type}</span>}
                          {j.salary && <span>💰 {j.salary}</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2">{j.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setTab("applications")} className="px-3 py-1.5 rounded-xl bg-cyan-50 text-purple-600 text-xs font-bold hover:bg-purple-100">Applications</button>
                      <button onClick={() => openEdit(j)} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100">Edit</button>
                      <button onClick={() => handleDelete(j._id)} className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
          )
        )}

        {/* Applications Tab */}
        {tab === "applications" && (
          applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">No applications yet.</div>
          ) : (
            <div className="space-y-4">
              {applications.map(a => (
                <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-800">{a.name}</h3>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${appStatusColors[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        <span>📧 {a.email}</span>
                        {a.phone && <span>📞 {a.phone}</span>}
                        <span>💼 {a.jobTitle}</span>
                        <span>📅 {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {a.coverLetter && <p className="text-gray-500 text-sm line-clamp-2 mt-1">{a.coverLetter}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {a.resumeUrl && (
                        <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 transition-colors text-center">
                          Download Resume
                        </a>
                      )}
                      <select value={a.status} onChange={e => updateAppStatus(a._id, e.target.value)}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-bold focus:border-purple-500 focus:outline-none">
                        {["New", "Reviewed", "Shortlisted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">{editJob ? "Edit Job" : "Add New Job"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">x</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
              <JField label="Job Title *" value={form.title} onChange={f("title")} required />
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} required rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <JField label="Location" value={form.location} onChange={f("location")} placeholder="Hyderabad / Remote" />
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white">
                    {["Full-time", "Part-time", "Contract", "Internship"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <JField label="Salary" value={form.salary} onChange={f("salary")} placeholder="12-18 LPA" />
                <JField label="Department" value={form.department} onChange={f("department")} placeholder="Engineering" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <JField label="Experience" value={form.experience} onChange={f("experience")} placeholder="2-4 years" />
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white">
                    {["Open", "Closed", "Draft"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Requirements (one per line)</label>
                <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white resize-none text-gray-900 bg-white" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 disabled:opacity-60">
                  {saving ? "Saving..." : editJob ? "Update Job" : "Create Job"}
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

const JField = ({ label, value, onChange, required, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm text-gray-900 bg-white"
    />
  </div>
);
